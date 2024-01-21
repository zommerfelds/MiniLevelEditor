import Phaser from 'phaser'

import { Scene } from 'phaser'

class MyScene extends Scene {
    constructor() {
        super({ key: 'MyScene' })
    }

    preload() {
        this.load.spritesheet('tiles', 'test.png', { frameWidth: 16, frameHeight: 16 })
    }

    create(): void {
        console.log('Starting Phaser scene')

        const scale = 5

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const img = this.add.image(x * 16 * scale, y * 16 * scale, 'tiles', Math.floor(Math.random() * 4))
                img.setOrigin(0, 0)
                img.scale = scale
            }
        }

        const graphics = this.add.graphics()
        graphics.alpha = 0.5
        graphics.lineStyle(1, 0xffffff)

        let y = 16
        while (y < this.renderer.height) {
            graphics.lineBetween(0, y * scale, this.renderer.width, y * scale)
            y += 16
        }
        let x = 16
        while (x < this.renderer.height) {
            graphics.lineBetween(x * scale, 0, x * scale, this.renderer.height)
            x += 16
        }
    }
}

// Inspired by https://github.com/Sun0fABeach/breakout
function launch(containerId: string): Phaser.Game {
    return new Phaser.Game({
        type: Phaser.AUTO,
        //width: 16 * 6,
        //height: 16 * 6,
        scale: {
            mode: Phaser.Scale.RESIZE,
        },
        pixelArt: true,
        antialias: false,
        autoRound: true,
        roundPixels: true,
        parent: containerId,
        scene: [MyScene]
    })
}

export default launch
export { launch }