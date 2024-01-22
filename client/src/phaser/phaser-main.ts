import Phaser from 'phaser'
import { Scene } from 'phaser'
import { useWorldStore } from '@/stores/world'
import { toRaw } from 'vue'

class MyScene extends Scene {
  origDragPoint?: Phaser.Math.Vector2 = undefined
  store = useWorldStore()

  constructor() {
    super({ key: 'MyScene' })
  }

  preload() {
    this.load.spritesheet('tiles', 'test.png', { frameWidth: 16, frameHeight: 16 })
  }

  create(): void {
    console.log('Starting Phaser scene')

    const level = toRaw(this.store.levels[0])
    console.log(level)
    const width = level.width
    const height = level.height

    this.cameras.main.setZoom(5)
    this.cameras.main.centerOn((width * 16) / 2, (height * 16) / 2)

    this.input.on('wheel', (_pointer: any, _gameObjects: any, _deltaX: any, deltaY: number) => {
      this.cameras.main.zoom *= 1 - deltaY * 0.001
    })

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const img = this.add.image(x * 16.3, y * 16.3, 'tiles', level.layers[0].data[x + y * width])
        img.setOrigin(0, 0)
      }
    }
  }

  update(): void {
    if (this.game.input.activePointer.isDown && this.game.input.activePointer.button == 1) {
      if (this.origDragPoint) {
        this.cameras.main.scrollX +=
          (this.origDragPoint.x - this.game.input.activePointer.position.x) / this.cameras.main.zoom
        this.cameras.main.scrollY +=
          (this.origDragPoint.y - this.game.input.activePointer.position.y) / this.cameras.main.zoom
      }
      this.origDragPoint = this.game.input.activePointer.position.clone()
    } else {
      this.origDragPoint = undefined
    }
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
