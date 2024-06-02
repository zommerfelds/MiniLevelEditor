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
  levelUtils = new LevelUtils()
  world = useWorldStore()
  tools = useToolsStore()
  tilesetUtils = new TilesetUtils()
  // For each layer, a 2D array with all the tiles:
  tiles: Array<Array<Array<Phaser.GameObjects.Image>>> = []
  // Used to render tiles on top of the map, e.g. for the move tool.
  overlayTile?: Phaser.GameObjects.Image
  overlayTile2?: Phaser.GameObjects.Rectangle
  overlayTile3?: Phaser.GameObjects.Image
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
  selection?: { left: number; top: number; right: number; bottom: number }
  renderedSelection?: { left: number; top: number; right: number; bottom: number }
  selectionToolGraphics?: Phaser.GameObjects.Graphics

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
      this.selection = undefined
    })
    delKey?.on('down', () => {
      if (this.selection === undefined) return
      for (let x = this.selection.left; x < this.selection.right; x++) {
        for (let y = this.selection.top; y < this.selection.bottom; y++) {
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
    this.overlayTile = this.add.image(0, 0, 'tiles')
    this.overlayTile.setOrigin(0.5, 1)
    this.overlayTile.visible = false
    this.overlayTile.alpha = 0.7

    this.overlayTile2 = this.add.rectangle(0, 0, this.cellWidth, this.cellHeight, 0x000000, 0.6)
    this.overlayTile2.setOrigin(0.5, 1)
    this.overlayTile2.visible = false

    this.overlayTile3 = this.add.image(0, 0, 'tiles')
    this.overlayTile3.setOrigin(0.5, 1)
    this.overlayTile3.visible = false
    this.overlayTile3.alpha = 0.7

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
        this.select()
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
    if (this.selection === this.renderedSelection) return

    this.selectionToolGraphics?.clear()
    if (this.selection !== undefined) {
      this.selectionToolGraphics?.lineStyle(0.5, 0xffffff)
      this.selectionToolGraphics?.strokeRect(
        this.selection.left * this.cellWidth + 0.5,
        this.selection.top * this.cellHeight + 0.5,
        (this.selection.right - this.selection.left) * this.cellWidth - 1,
        (this.selection.bottom - this.selection.top) * this.cellHeight - 1
      )
    }
    this.renderedSelection = this.selection
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
    )
      return

    const startTileId = currentLayer.data[startTilePos.x + startTilePos.y * this.level.width]!
    const targetTileId = currentLayer.data[targetTilePos.x + targetTilePos.y * this.level.width]!
    if (this.tilesetUtils.isEmptyTileIndex(startTileId)) return

    if (doneMove) {
      this.overlayTile!.visible = false
      this.overlayTile2!.visible = false
      this.overlayTile3!.visible = false

      if (this.tools.toolOptionMoveSwap) {
        this.setTileId(startTilePos.x, startTilePos.y, targetTileId)
      } else {
        this.setTileId(startTilePos.x, startTilePos.y, -1)
      }
      this.setTileId(targetTilePos.x, targetTilePos.y, startTileId)
    } else {
      this.overlayTile!.visible = true
      this.overlayTile!.setFrame(startTileId)
      this.overlayTile!.x =
        this.tiles[this.tools.selectedLayer]![targetTilePos.x]![targetTilePos.y]!.x
      this.overlayTile!.y =
        this.tiles[this.tools.selectedLayer]![targetTilePos.x]![targetTilePos.y]!.y

      if (this.tools.toolOptionMoveSwap && !this.tilesetUtils.isEmptyTileIndex(targetTileId)) {
        // TODO: This black layer looks bad. Better to add transparency to the actual object. But this would require refactoring the code to separate
        //       the tiles from the real committed data.
        this.overlayTile2!.visible = false
        this.overlayTile3!.visible = true
        this.overlayTile3!.setFrame(targetTileId)
        this.overlayTile3!.x =
          this.tiles[this.tools.selectedLayer]![startTilePos.x]![startTilePos.y]!.x
        this.overlayTile3!.y =
          this.tiles[this.tools.selectedLayer]![startTilePos.x]![startTilePos.y]!.y
      } else {
        this.overlayTile3!.visible = false
        this.overlayTile2!.visible = true
        this.overlayTile2!.x =
          this.tiles[this.tools.selectedLayer]![startTilePos.x]![startTilePos.y]!.x
        this.overlayTile2!.y =
          this.tiles[this.tools.selectedLayer]![startTilePos.x]![startTilePos.y]!.y
      }
    }
  }

  select() {
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

    this.selection = {
      left: Math.min(startTilePos.x, targetTilePos.x),
      right: Math.max(startTilePos.x, targetTilePos.x) + 1,
      top: Math.min(startTilePos.y, targetTilePos.y),
      bottom: Math.max(startTilePos.y, targetTilePos.y) + 1,
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
