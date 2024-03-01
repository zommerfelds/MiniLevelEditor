import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import Phaser, { Scene } from 'phaser'
import { toRaw, watch, computed } from 'vue'

export class LevelScene extends Scene {
  origDragPoint?: Phaser.Math.Vector2 = undefined
  origToolBeforeDrag?: Tool = undefined
  store = useWorldStore()
  tools = useToolsStore()
  // For each layer, a 2D array with all the tiles:
  tiles: Array<Array<Array<Phaser.GameObjects.Image>>> = []
  oldDisplayWidth: number = -1
  oldScrollX: number = -1
  oldScrollY: number = -1
  oldZoom: number = -1
  oldDisplayHeight: number = -1
  dataIsReady = false
  constructor() {
    super({ key: 'MyScene' })
  }

  preload() {
    this.dataIsReady = this.store.data.config != undefined

    if (this.dataIsReady) {
      let tileSetFile = ''

      if (this.store.data.config.tileset == '__builtin') {
        tileSetFile = 'built-in-tileset.png'
      } else {
        tileSetFile = 'api/tilesets/' + this.store.data.config.tileset
      }

      this.load.spritesheet('tiles', tileSetFile, {
        frameWidth: this.store.data.config.tilesetTileWidth,
        frameHeight: this.store.data.config.tilesetTileHeight,
      })
    }
  }

  create(): void {
    console.log('Starting Phaser scene')

    this.watchForLevelChanges()
    if (!this.dataIsReady) return

    if (this.tools.selectedLevel < 0 || this.tools.selectedLevel >= this.store.data.levels.length)
      return

    this.scale.off('resize')
    this.scale.on('resize', this.onResize, this)

    const level = toRaw(this.store.data.levels[this.tools.selectedLevel])

    if (this.oldScrollX == -1) {
      // TODO: improve camera start position (top left?)
      this.cameras.main.setZoom(5)
      this.cameras.main.centerOn(
        (level.width * this.store.data.config.gridCellWidth) / 2,
        (level.height * this.store.data.config.gridCellHeight) / 2
      )
    } else {
      // This is a level reload, keep same camera properties.
      this.cameras.main.scrollX = this.oldScrollX
      this.cameras.main.scrollY = this.oldScrollY
      this.cameras.main.zoom = this.oldZoom
    }

    this.input.on('wheel', (_pointer: any, _gameObjects: any, _deltaX: any, deltaY: number) => {
      this.cameras.main.zoom *= 1 - deltaY * 0.001
    })

    for (let layer = 0; layer < this.store.data.config.layers.length; layer++) {
      this.tiles[layer] = []
      for (let x = 0; x < level.width; x++) {
        this.tiles[layer][x] = []
        for (let y = 0; y < level.height; y++) {
          const data = level.layers[layer].data[x + y * level.width]
          const frame = this.store.data.config.tiles[data].index
          const isEmptyTile = frame == undefined
          const img = this.add.image(
            // Tile is aligned to the middle bottom. Consider making this configurable.
            (x + 0.5) * this.store.data.config.gridCellWidth,
            (y + 1) * this.store.data.config.gridCellHeight,
            'tiles',
            isEmptyTile ? 0 : frame
          )
          img.setOrigin(0.5, 1)
          img.visible = !isEmptyTile
          this.tiles[layer][x][y] = img
        }
      }
    }

    this.addGrid(
      level.width,
      level.height,
      this.store.data.config.gridCellWidth,
      this.store.data.config.gridCellHeight
    )

    this.oldDisplayWidth = this.renderer.width
    this.oldDisplayHeight = this.renderer.height
  }

  watchForLevelChanges() {
    const watchLevelSelectionStopHandle = watch(
      [
        computed(() => this.store.isDefaultData),
        computed(() => JSON.stringify(this.store.data?.config)),
        computed(() => this.tools.selectedLevel),
      ],
      (
        [isDefaultData, configStr, selectedLevel],
        [prevIsDefaultData, prevConfigStr, prevSelectedLevel]
      ) => {
        if (
          isDefaultData == prevIsDefaultData &&
          configStr == prevConfigStr &&
          selectedLevel == prevSelectedLevel
        )
          return
        const config = JSON.parse(configStr || '{}')
        const prevConfig = JSON.parse(prevConfigStr || '{}')
        if (
          ['tileset', 'tilesetTileWidth', 'tilesetTileHeight'].some(
            (key) => config[key] != prevConfig[key]
          ) &&
          this.textures.exists('tiles')
        ) {
          this.textures.remove('tiles')
        }
        this.scene.restart()
      }
    )

    this.events.off('destroy') // Remove existing destroy handlers (may happen if the scene is restarted).
    this.events.once('destroy', watchLevelSelectionStopHandle) // Remove watch when Phaser is fully destroyed (e.g. hot reload).
    this.events.once('shutdown', watchLevelSelectionStopHandle) // Remove watch when the scene is restarted.
  }

  onResize(gameSize: { width: number; height: number }): void {
    if (!this.dataIsReady) return

    // Fix render size and camera movement after resizing.
    this.renderer.resize(gameSize.width, gameSize.height)
    this.cameras.main.width = gameSize.width
    this.cameras.main.height = gameSize.height
    this.cameras.main.scrollX +=
      (1 - 1 / this.cameras.main.zoom) * (this.oldDisplayWidth - gameSize.width) * 0.5

    this.cameras.main.scrollY +=
      (1 - 1 / this.cameras.main.zoom) * (this.oldDisplayHeight - gameSize.height) * 0.5

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
    if (!this.dataIsReady) return

    this.handleMouse()

    this.oldScrollX = this.cameras.main.scrollX
    this.oldScrollY = this.cameras.main.scrollY
    this.oldZoom = this.cameras.main.zoom
  }

  handleMouse(): void {
    if (this.game.input.activePointer.button == 1) {
      // Middle mouse button not supported yet.
      return
    }
    const mouseDown =
      this.game.input.activePointer.isDown &&
      this.game.input.activePointer.downElement == this.game.canvas

    if (mouseDown && this.game.input.activePointer.button == 2) {
      if (this.origToolBeforeDrag == undefined) {
        this.origToolBeforeDrag = this.tools.selectedTool
        this.tools.selectedTool = Tool.Move
      }
    }
    if (!mouseDown) {
      this.origDragPoint = undefined
      if (this.origToolBeforeDrag != undefined) {
        this.tools.selectedTool = this.origToolBeforeDrag
        this.origToolBeforeDrag = undefined
      }
      return
    }
    switch (this.tools.selectedTool) {
      case Tool.Move:
        this.move()
        break
      case Tool.Draw:
        this.draw()
        break
    }
  }

  move() {
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

    if (
      tilePos.x < 0 ||
      tilePos.x >= this.store.data.levels[this.tools.selectedLevel].width ||
      tilePos.y < 0 ||
      tilePos.y >= this.store.data.levels[this.tools.selectedLevel].height
    )
      return

    const tileId = this.store.data.config.tiles[this.tools.selectedTile].index
    const visible = tileId != undefined
    const img = this.tiles[this.tools.selectedLayer][tilePos.x][tilePos.y]
    if (img.visible != visible || img.frame.name != String(tileId)) {
      img.setFrame(tileId)
      img.visible = visible
      this.store.data.levels[this.tools.selectedLevel].layers[this.tools.selectedLayer].data[
        tilePos.x + tilePos.y * this.store.data.levels[this.tools.selectedLevel].width
      ] = this.tools.selectedTile
    }
  }

  worldToTile(worldPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Math.floor(worldPos.x / this.store.data.config.gridCellWidth),
      Math.floor(worldPos.y / this.store.data.config.gridCellHeight)
    )
  }
}
