import type { Level } from '@common/dataTypes'

export class LevelUtils {
  indexToPos(level: Level, index: number): { x: number; y: number } {
    return { x: index % level.width, y: Math.floor(index / level.width) }
  }
  posToIndex(level: Level, x: number, y: number): number {
    return x + y * level.width
  }
  getTileIdAt(level: Level, x: number, y: number, layer: number): number | undefined {
    return level.layers[layer]?.data[this.posToIndex(level, x, y)]
  }
}
