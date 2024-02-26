import Phaser from 'phaser'
import { LevelScene } from '@/phaser/LevelScene'

// Inspired by https://github.com/Sun0fABeach/breakout
export function launch(containerId: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
    antialias: false,
    autoRound: true,
    roundPixels: false,
    parent: containerId,
    scene: [LevelScene],
  })
}
