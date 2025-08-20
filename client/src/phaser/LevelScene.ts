import { LevelUtils } from '@/logic/LevelUtils'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import type { Level } from '@common/dataTypes'
import Phaser, { Scene } from 'phaser'
import { watch, computed } from 'vue'

export class LevelScene extends Scene {
  lastDragPt?: Phaser.Math.Vector2 = undefined
  origToolBeforeDrag?: Tool = undefined
  dragStart?: Phaser.Math.Vector2 = undefined
  movedDuringDrag: boolean = false
  levelUtils = new LevelUtils()
  world = useWorldStore()
  tools = useToolsStore()
  tilesetUtils = new TilesetUtils()
  // For each layer, a 2D array with all the tiles:
  tiles: Array<Array<Array<Phaser.GameObjects.Image>>> = []
  // Used to render tiles on top of the map, e.g. for the move tool.
  oldDisplayWidth?: number
  oldScrollX?: number
  oldScrollY?: number
  oldZoom?: number
  oldDisplayHeight?: number
  initializing = true
  level?: Level
  loadedImage: string = ''
  // Convenience variables to get the grid cell size
  cellWidth = 1
  cellHeight = 1
  renderedSelection?: { left: number; top: number; right: number; bottom: number }
  selectionToolGraphics?: Phaser.GameObjects.Graphics
  overlayTiles: Array<Array<Phaser.GameObjects.Image>> = []

  constructor() {
    super({ key: 'MyScene' })
  }

  preload() {
    this.initializing = true
    this.watchForLevelChanges()

    if (this.world.isLoaded && this.world.tilesetUrl !== '') {
      const tileSetFile = this.world.tilesetUrl
      if (tileSetFile !== this.loadedImage && this.textures.exists('tiles')) {
        this.textures.remove('tiles')
      }
      this.loadedImage = tileSetFile
      this.load.atlas('tiles', tileSetFile, this.tilesetUtils.getAtlas())

      this.setUpKeyboardHandlers()
    }
  }

  setUpKeyboardHandlers() {
    const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    const delKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE)

    escKey?.on('down', () => {
      this.tools.selectionToolRect = undefined
    })
    delKey?.on('down', () => {
      if (this.tools.selectionToolRect === undefined) return
      for (let x = this.tools.selectionToolRect.left; x < this.tools.selectionToolRect.right; x++) {
        for (
          let y = this.tools.selectionToolRect.top;
          y < this.tools.selectionToolRect.bottom;
          y++
        ) {
          this.setTileId(x, y, -1)
        }
      }
    })
  }

  create(): void {
    if (!this.world.isLoaded || this.loadedImage === '') return

    if (
      this.tools.selectedLevel < 0 ||
      this.tools.selectedLevel >= this.world.getWorldData().levels.length
    )
      return

    this.level = this.world.getWorldData().levels[this.tools.selectedLevel]
    if (this.level === undefined) return

    console.log('Loading Phaser scene')

    this.scale.off('resize')
    this.scale.on('resize', this.onResize, this)

    // Lose focus when canvas is clicked. This doesn't seem to happen automatically. If we don't do this
    // and you press delete, enter or tab, it will do weird stuff with UI elements like the tool selector.
    this.input.off('pointerdown')
    this.input.on('pointerdown', () => (document.activeElement as HTMLElement)?.blur())

    this.cellWidth = this.world.getWorldData().config.gridCellWidth
    this.cellHeight = this.world.getWorldData().config.gridCellHeight

    if (this.oldScrollX === undefined) {
      // TODO: improve camera start position (top left?)
      this.cameras.main.setZoom(5)
      this.cameras.main.centerOn(
        (this.level.width * this.cellWidth) / 2,
        (this.level.height * this.cellHeight) / 2
      )
    } else {
      // This is a level reload, keep same camera properties.
      this.cameras.main.scrollX = this.oldScrollX
      this.cameras.main.scrollY = this.oldScrollY!
      this.cameras.main.zoom = this.oldZoom!
    }

    this.input.on('wheel', (_pointer: any, _gameObjects: any, _deltaX: any, deltaY: number) => {
      this.cameras.main.zoom *= 1 - deltaY * 0.001
    })

    this.tiles = []
    for (let layer = 0; layer < this.world.getWorldData().config.layers.length; layer++) {
      this.tiles[layer] = []
      for (let x = 0; x < this.level.width; x++) {
        this.tiles[layer]![x] = []
        for (let y = 0; y < this.level.height; y++) {
          const data = this.levelUtils.getTileIdAt(this.level, x, y, layer)
          const isEmptyTile = this.tilesetUtils.isEmptyTileIndex(data)
          const img = this.add.image(
            // Tile is aligned to the middle bottom. Consider making this configurable.
            (x + 0.5) * this.cellWidth,
            (y + 1) * this.cellHeight,
            'tiles',
            isEmptyTile ? 0 : String(data)
          )
          img.setOrigin(0.5, 1)
          img.visible = !isEmptyTile
          this.tiles[layer]![x]![y] = img
        }
      }
    }
    this.overlayTiles = Array.from({ length: this.level!.width }, () =>
      Array.from({ length: this.level!.height }, () => {
        const overlay = this.add.image(0, 0, 'tiles')
        overlay.setOrigin(0.5, 1)
        overlay.visible = false
        overlay.alpha = 0.7
        return overlay
      })
    )

    this.addGrid(this.level.width, this.level.height, this.cellWidth, this.cellHeight)

    this.selectionToolGraphics = this.add.graphics()
    this.add.tween({
      targets: [this.selectionToolGraphics],
      duration: 500,
      alpha: 0.5,
      repeat: -1,
      yoyo: true,
    })

    this.oldDisplayWidth = this.renderer.width
    this.oldDisplayHeight = this.renderer.height
    this.initializing = false
  }

  watchForLevelChanges() {
    const watchLevelSelectionStopHandle = watch(
      [
        // Reload when the user loaded a file and is no longer using default data:
        computed(() => this.world.isDefaultData),
        // Reload if the config changed (e.g. tile size):
        computed(() =>
          this.world.isLoaded ? JSON.stringify(this.world.getWorldData().config) : ''
        ),
        // Reference to current level should stay the same (note that the index can stay but the underlying level can change):
        computed(() =>
          this.world.isLoaded
            ? this.world.getWorldData().levels[this.tools.selectedLevel]
            : undefined
        ),
        // Reload if the revision changed without us knowing (e.g. undo):
        computed(() => this.world.dataRevision),
        // The tileset URL may change later as it may need to be generated from a file on disk.
        computed(() => this.world.tilesetUrl),
      ],
      () => this.scene.restart()
    )

    this.events.off('destroy') // Remove existing destroy handlers (may happen if the scene is restarted).
    this.events.once('destroy', watchLevelSelectionStopHandle) // Remove watch when Phaser is fully destroyed (e.g. hot reload).
    this.events.once('shutdown', watchLevelSelectionStopHandle) // Remove watch when the scene is restarted.
  }

  onResize(gameSize: { width: number; height: number }): void {
    if (this.initializing) return

    // Fix render size and camera movement after resizing.
    this.renderer.resize(gameSize.width, gameSize.height)
    this.cameras.main.width = gameSize.width
    this.cameras.main.height = gameSize.height
    this.cameras.main.scrollX +=
      (1 - 1 / this.cameras.main.zoom) * (this.oldDisplayWidth! - gameSize.width) * 0.5

    this.cameras.main.scrollY +=
      (1 - 1 / this.cameras.main.zoom) * (this.oldDisplayHeight! - gameSize.height) * 0.5

    this.oldDisplayWidth = gameSize.width
    this.oldDisplayHeight = gameSize.height
  }

  addGrid(width: number, height: number, gridCellWidth: number, gridCellHeight: number) {
    const graphics = this.add.graphics()
    graphics.lineStyle(0.2, 0x222222)
    graphics.beginPath()

    for (let x = 0; x < width + 1; x++) {
      graphics.moveTo(x * gridCellWidth, 0)
      graphics.lineTo(x * gridCellWidth, height * gridCellHeight)
    }
    for (let y = 0; y < height + 1; y++) {
      graphics.moveTo(0, y * gridCellHeight)
      graphics.lineTo(width * gridCellWidth, y * gridCellHeight)
    }

    graphics.closePath()
    graphics.strokePath()
  }

  update(): void {
    if (this.initializing) return

    this.handleMouse()

    this.renderSelection()

    this.oldScrollX = this.cameras.main.scrollX
    this.oldScrollY = this.cameras.main.scrollY
    this.oldZoom = this.cameras.main.zoom
  }

  handleMouse(): void {
    if (this.game.input.activePointer.button === 1) {
      // Middle mouse button not supported yet.
      return
    }
    const mouseDown =
      this.game.input.activePointer.isDown &&
      this.game.input.activePointer.downElement === this.game.canvas

    if (mouseDown && this.game.input.activePointer.button === 2) {
      if (this.origToolBeforeDrag === undefined) {
        this.origToolBeforeDrag = this.tools.selectedTool
        this.tools.selectedTool = Tool.Pan
      }
    }
    if (mouseDown && !this.dragStart) {
      this.dragStart = this.cameras.main.getWorldPoint(
        this.game.input.activePointer.position.x,
        this.game.input.activePointer.position.y
      )
      this.movedDuringDrag = false
    }
    if (mouseDown) {
      const worldPos = this.cameras.main.getWorldPoint(
        this.game.input.activePointer.position.x,
        this.game.input.activePointer.position.y
      )
      if (this.dragStart!.x !== worldPos.x || this.dragStart!.y !== worldPos.y) {
        this.movedDuringDrag = true
      }
    }
    if (this.dragStart === undefined) return
    switch (this.tools.selectedTool) {
      case Tool.Pan:
        this.pan()
        break
      case Tool.Draw:
      case Tool.Erase:
        this.draw()
        break
      case Tool.Move:
        this.move(!mouseDown)
        break
      case Tool.Select:
        this.select(mouseDown)
        if (!mouseDown && this.tools.selectionToolRect) {
          this.tools.selectedTool = Tool.Move
        }
        break
    }
    if (!mouseDown) {
      this.dragStart = undefined
      this.lastDragPt = undefined
      if (this.origToolBeforeDrag !== undefined) {
        this.tools.selectedTool = this.origToolBeforeDrag
        this.origToolBeforeDrag = undefined
      }
    }
  }

  renderSelection() {
    if (this.tools.selectionToolRect === this.renderedSelection) return

    this.selectionToolGraphics?.clear()
    if (this.tools.selectionToolRect !== undefined) {
      this.selectionToolGraphics?.lineStyle(0.5, 0xffffff)
      this.selectionToolGraphics?.strokeRect(
        this.tools.selectionToolRect.left * this.cellWidth + 0.5,
        this.tools.selectionToolRect.top * this.cellHeight + 0.5,
        (this.tools.selectionToolRect.right - this.tools.selectionToolRect.left) * this.cellWidth -
          1,
        (this.tools.selectionToolRect.bottom - this.tools.selectionToolRect.top) * this.cellHeight -
          1
      )
    }
    this.renderedSelection = this.tools.selectionToolRect
  }

  pan() {
    if (this.lastDragPt) {
      this.cameras.main.scrollX +=
        (this.lastDragPt.x - this.game.input.activePointer.position.x) / this.cameras.main.zoom
      this.cameras.main.scrollY +=
        (this.lastDragPt.y - this.game.input.activePointer.position.y) / this.cameras.main.zoom
    }
    this.lastDragPt = this.game.input.activePointer.position.clone()
  }

  draw() {
    const worldPos = this.cameras.main.getWorldPoint(
      this.game.input.activePointer.position.x,
      this.game.input.activePointer.position.y
    )
    const tilePos = this.worldToTile(worldPos)

    const currentLayer = this.level?.layers[this.tools.selectedLayer]
    if (
      this.level === undefined ||
      currentLayer === undefined ||
      tilePos.x < 0 ||
      tilePos.x >= this.level.width ||
      tilePos.y < 0 ||
      tilePos.y >= this.level.height
    )
      return

    const tileId = this.tools.selectedTool === Tool.Erase ? -1 : this.tools.selectedTile // selectedTile is the index in this.world.getWorldData().config.tiles
    this.setTileId(tilePos.x, tilePos.y, tileId)
  }

  clearOverlays() {
    for (let x = 0; x < this.level!.width; x++) {
      for (let y = 0; y < this.level!.height; y++) {
        this.overlayTiles[x]![y]!.visible = false
      }
    }
  }

  move(doneMove: boolean) {
    const startTilePos = this.worldToTile(this.dragStart!)
    const currentLayer = this.level?.layers[this.tools.selectedLayer]

    const targetWorldPos = this.cameras.main.getWorldPoint(
      this.game.input.activePointer.position.x,
      this.game.input.activePointer.position.y
    )
    const targetTilePos = this.worldToTile(targetWorldPos)

    if (
      this.level === undefined ||
      currentLayer === undefined ||
      startTilePos.x < 0 ||
      startTilePos.x >= this.level.width ||
      startTilePos.y < 0 ||
      startTilePos.y >= this.level.height ||
      targetTilePos.x < 0 ||
      targetTilePos.x >= this.level.width ||
      targetTilePos.y < 0 ||
      targetTilePos.y >= this.level.height
    ) {
      this.clearOverlays()
      return
    }

    const selectionRect = this.tools.selectionToolRect || {
      left: startTilePos.x,
      right: startTilePos.x + 1,
      top: startTilePos.y,
      bottom: startTilePos.y + 1,
    }

    const deltaX = targetTilePos.x - startTilePos.x
    const deltaY = targetTilePos.y - startTilePos.y

    if (doneMove) {
      this.clearOverlays()
      const tempTiles: Array<{ x: number; y: number; tileId: number }> = []

      // Store tiles in a temporary array
      for (let x = selectionRect.left; x < selectionRect.right; x++) {
        for (let y = selectionRect.top; y < selectionRect.bottom; y++) {
          const tileId = currentLayer.data[x + y * this.level.width]!
          if (!this.tilesetUtils.isEmptyTileIndex(tileId)) {
            tempTiles.push({ x, y, tileId })
            this.setTileId(x, y, -1) // Clear original position
          }
        }
      }

      if (this.tools.toolOptionMoveSwap) {
        for (let x = selectionRect.left; x < selectionRect.right; x++) {
          for (let y = selectionRect.top; y < selectionRect.bottom; y++) {
            const targetX = x + deltaX
            const targetY = y + deltaY
            if (
              targetX >= selectionRect.left &&
              targetX < selectionRect.right &&
              targetY >= selectionRect.top &&
              targetY < selectionRect.bottom
            ) {
              continue // Overlapping area, assume empty
            }
            const targetTileId = currentLayer.data[targetX + targetY * this.level.width]!
            if (!this.tilesetUtils.isEmptyTileIndex(targetTileId)) {
              this.setTileId(x, y, targetTileId) // Swap back to original position
              this.setTileId(targetX, targetY, -1) // Clear the target position
            }
          }
        }
      }

      // Move tiles from temporary array to new position
      for (const { x, y, tileId } of tempTiles) {
        this.setTileId(x + deltaX, y + deltaY, tileId)
      }

      if (this.tools.selectionToolRect) {
        this.tools.selectionToolRect = {
          left: selectionRect.left + deltaX,
          right: selectionRect.right + deltaX,
          top: selectionRect.top + deltaY,
          bottom: selectionRect.bottom + deltaY,
        }
      }
    } else {
      this.clearOverlays()
      for (let x = selectionRect.left; x < selectionRect.right; x++) {
        for (let y = selectionRect.top; y < selectionRect.bottom; y++) {
          const tileId = currentLayer.data[x + y * this.level.width]!
          if (!this.tilesetUtils.isEmptyTileIndex(tileId)) {
            const overlay = this.overlayTiles[x + deltaX]![y + deltaY]!
            overlay.setFrame(tileId)
            overlay.x = this.tiles[this.tools.selectedLayer]![x + deltaX]![y + deltaY]!.x!
            overlay.y = this.tiles[this.tools.selectedLayer]![x + deltaX]![y + deltaY]!.y!
            overlay.visible = true
          }
        }
      }

      if (this.tools.toolOptionMoveSwap) {
        for (let x = selectionRect.left; x < selectionRect.right; x++) {
          for (let y = selectionRect.top; y < selectionRect.bottom; y++) {
            const targetX = x + deltaX
            const targetY = y + deltaY
            if (
              targetX >= selectionRect.left &&
              targetX < selectionRect.right &&
              targetY >= selectionRect.top &&
              targetY < selectionRect.bottom
            ) {
              continue // Overlapping area, assume empty
            }
            const targetTileId = currentLayer.data[targetX + targetY * this.level.width]!
            if (!this.tilesetUtils.isEmptyTileIndex(targetTileId)) {
              const swapOverlay = this.overlayTiles[x]![y]!
              swapOverlay.setFrame(targetTileId)
              swapOverlay.x = this.tiles[this.tools.selectedLayer]![x]![y]!.x!
              swapOverlay.y = this.tiles[this.tools.selectedLayer]![x]![y]!.y!
              swapOverlay.visible = true
            }
          }
        }
      }
    }
  }

  select(mouseDown: boolean) {
    const startTilePos = this.worldToTile(this.dragStart!)
    const currentLayer = this.level?.layers[this.tools.selectedLayer]

    const targetWorldPos = this.cameras.main.getWorldPoint(
      this.game.input.activePointer.position.x,
      this.game.input.activePointer.position.y
    )
    const targetTilePos = this.worldToTile(targetWorldPos)

    if (
      this.level === undefined ||
      currentLayer === undefined ||
      startTilePos.x < 0 ||
      startTilePos.x >= this.level.width ||
      startTilePos.y < 0 ||
      startTilePos.y >= this.level.height ||
      targetTilePos.x < 0 ||
      targetTilePos.x >= this.level.width ||
      targetTilePos.y < 0 ||
      targetTilePos.y >= this.level.height
    )
      return

    const tileSelection = {
      left: Math.min(startTilePos.x, targetTilePos.x),
      right: Math.max(startTilePos.x, targetTilePos.x) + 1,
      top: Math.min(startTilePos.y, targetTilePos.y),
      bottom: Math.max(startTilePos.y, targetTilePos.y) + 1,
    }
    if (!this.movedDuringDrag) {
      if (!mouseDown) {
        if (this.tools.selectionToolRect) {
          this.tools.selectionToolRect = undefined
        } else {
          this.tools.selectionToolRect = tileSelection
        }
      }
    } else {
      this.tools.selectionToolRect = tileSelection
    }
  }

  setTileId(x: number, y: number, tileId: number) {
    const currentLayer = this.level?.layers[this.tools.selectedLayer]!
    const visible = !this.tilesetUtils.isEmptyTileIndex(tileId)
    const img = this.tiles[this.tools.selectedLayer]?.[x]?.[y]
    if (img !== undefined && (img.visible !== visible || img.frame.name !== String(tileId))) {
      if (visible) {
        img.setFrame(tileId)
      }
      img.visible = visible
    }
    currentLayer.data[x + y * this.level!.width] = tileId
  }

  worldToTile(worldPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Math.floor(worldPos.x / this.world.getWorldData().config.gridCellWidth),
      Math.floor(worldPos.y / this.world.getWorldData().config.gridCellHeight)
    )
  }
}
