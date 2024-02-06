import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import Phaser, { Scene } from 'phaser'
import { toRaw, watchEffect } from 'vue'

class MyScene extends Scene {
  origDragPoint?: Phaser.Math.Vector2 = undefined
  origToolBeforeDrag?: Tool = undefined
  store = useWorldStore()
  tools = useToolsStore()
  tileWidth: number = 16
  tileHeight: number = 16
  tiles: Array<Array<Phaser.GameObjects.Image>> = []
  oldDisplayWidth: number = 1
  oldDisplayHeight: number = 1
  loadedLevel = -1

  constructor() {
    super({ key: 'MyScene' })
  }

  preload() {
    this.load.spritesheet('tiles', 'test.png', { frameWidth: 16, frameHeight: 16 })
  }

  create(): void {
    console.log('Starting Phaser scene')
    this.loadedLevel = this.tools.selectedLevel

    this.watchForLevelChanges()

    if (this.loadedLevel < 0 || this.loadedLevel >= this.store.levels.length) return

    this.scale.off('resize')
    this.scale.on('resize', this.onResize, this)

    const level = toRaw(this.store.levels[this.loadedLevel])
    const width = level.width
    const height = level.height

    this.cameras.main.setZoom(5)
    this.cameras.main.centerOn((width * 16) / 2, (height * 16) / 2)

    this.input.on('wheel', (_pointer: any, _gameObjects: any, _deltaX: any, deltaY: number) => {
      this.cameras.main.zoom *= 1 - deltaY * 0.001
    })

    for (let x = 0; x < width; x++) {
      this.tiles[x] = []
      for (let y = 0; y < height; y++) {
        const img = this.add.image(x * 16.3, y * 16.3, 'tiles', level.layers[0].data[x + y * width])
        img.setOrigin(0, 0)
        this.tiles[x][y] = img
      }
    }
    this.oldDisplayWidth = this.renderer.width
    this.oldDisplayHeight = this.renderer.height
  }

  watchForLevelChanges() {
    const watchLevelSelectionStopHandle = watchEffect(() => {
      if (this.loadedLevel == this.tools.selectedLevel) return
      this.scene.restart()
    })

    this.events.off('destroy') // Remove existing destroy handlers (may happen if the scene is restarted).
    this.events.once('destroy', watchLevelSelectionStopHandle) // Remove watch when Phaser is fully destroyed (e.g. hot reload).
    this.events.once('shutdown', watchLevelSelectionStopHandle) // Remove watch when the scene is restarted.
  }

  onResize(gameSize: { width: number; height: number }): void {
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

  update(): void {
    this.handleMouse()
  }

  handleMouse(): void {
    if (this.game.input.activePointer.button == 2) {
      // Right mouse button not supported yet.
      // TODO: do something with the right click, as it's currently suppressed in LevelContent.vue
      return
    }
    const mouseDown =
      this.game.input.activePointer.isDown &&
      this.game.input.activePointer.downElement == this.game.canvas

    if (mouseDown && this.game.input.activePointer.button == 1) {
      if (this.origToolBeforeDrag == undefined) {
        this.origToolBeforeDrag = this.tools.selectedTool
        this.tools.selectedTool = Tool.Move
      }
    }
    if (!mouseDown) {
      this.origDragPoint = undefined
      if (this.origToolBeforeDrag != undefined) {
        console.log('resetting tool')
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
      tilePos.x >= this.store.levels[this.tools.selectedLevel].width ||
      tilePos.y < 0 ||
      tilePos.y >= this.store.levels[this.tools.selectedLevel].height
    )
      return

    const tileId = this.tools.selectedTile - 1
    if (this.tiles[tilePos.x][tilePos.y].frame.name != String(tileId)) {
      this.tiles[tilePos.x][tilePos.y].setFrame(tileId)
      this.store.levels[this.tools.selectedLevel].layers[0].data[
        tilePos.x + tilePos.y * this.store.levels[this.tools.selectedLevel].width
      ] = tileId
    }
  }

  worldToTile(worldPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Math.floor(worldPos.x / this.tileWidth),
      Math.floor(worldPos.y / this.tileHeight)
    )
  }
}

// Inspired by https://github.com/Sun0fABeach/breakout
function launch(containerId: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
    antialias: false,
    autoRound: true,
    roundPixels: false,
    parent: containerId,
    scene: [MyScene],
  })
}

export default launch
export { launch }
