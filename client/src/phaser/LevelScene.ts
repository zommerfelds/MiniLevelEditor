import { LevelUtils } from '@/logic/LevelUtils'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import type { Level } from '@common/dataTypes'
import Phaser, { Scene } from 'phaser'
import { watch, computed } from 'vue'

export class LevelScene extends Scene {
  origDragPoint?: Phaser.Math.Vector2 = undefined
  origToolBeforeDrag?: Tool = undefined
  levelUtils = new LevelUtils()
  world = useWorldStore()
  tools = useToolsStore()
  tilesetUtils = new TilesetUtils()
  // For each layer, a 2D array with all the tiles:
  tiles: Array<Array<Array<Phaser.GameObjects.Image>>> = []
  oldDisplayWidth?: number
  oldScrollX?: number
  oldScrollY?: number
  oldZoom?: number
  oldDisplayHeight?: number
  initializing = true
  level?: Level
  loadedImage: string = ''
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
    }
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

    if (this.oldScrollX === undefined) {
      // TODO: improve camera start position (top left?)
      this.cameras.main.setZoom(5)
      this.cameras.main.centerOn(
        (this.level.width * this.world.getWorldData().config.gridCellWidth) / 2,
        (this.level.height * this.world.getWorldData().config.gridCellHeight) / 2
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
            (x + 0.5) * this.world.getWorldData().config.gridCellWidth,
            (y + 1) * this.world.getWorldData().config.gridCellHeight,
            'tiles',
            isEmptyTile ? 0 : String(data)
          )
          img.setOrigin(0.5, 1)
          img.visible = !isEmptyTile
          this.tiles[layer]![x]![y] = img
        }
      }
    }

    this.addGrid(
      this.level.width,
      this.level.height,
      this.world.getWorldData().config.gridCellWidth,
      this.world.getWorldData().config.gridCellHeight
    )

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
    if (!mouseDown) {
      this.origDragPoint = undefined
      if (this.origToolBeforeDrag !== undefined) {
        this.tools.selectedTool = this.origToolBeforeDrag
        this.origToolBeforeDrag = undefined
      }
      return
    }
    switch (this.tools.selectedTool) {
      case Tool.Pan:
        this.pan()
        break
      case Tool.Draw:
      case Tool.Erase:
        this.draw()
        break
    }
  }

  pan() {
    if (this.origDragPoint) {
      this.cameras.main.scrollX +=
        (this.origDragPoint.x - this.game.input.activePointer.position.x) / this.cameras.main.zoom
      this.cameras.main.scrollY +=
        (this.origDragPoint.y - this.game.input.activePointer.position.y) / this.cameras.main.zoom
    }
    this.origDragPoint = this.game.input.activePointer.position.clone()
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
    const visible = !this.tilesetUtils.isEmptyTileIndex(tileId)
    const img = this.tiles[this.tools.selectedLayer]?.[tilePos.x]?.[tilePos.y]
    if (img !== undefined && (img.visible !== visible || img.frame.name !== String(tileId))) {
      img.setFrame(tileId)
      img.visible = visible
      currentLayer.data[tilePos.x + tilePos.y * this.level.width] = this.tools.selectedTile
    }
  }

  worldToTile(worldPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Math.floor(worldPos.x / this.world.getWorldData().config.gridCellWidth),
      Math.floor(worldPos.y / this.world.getWorldData().config.gridCellHeight)
    )
  }
}
