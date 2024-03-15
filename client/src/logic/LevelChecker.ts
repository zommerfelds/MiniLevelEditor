import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { computed, watch } from 'vue'
import { LevelUtils } from './LevelUtils'

export class LevelChecker {
  world = useWorldStore()
  tools = useToolsStore()
  levelUtils = new LevelUtils()

  watch() {
    watch(
      [computed(() => this.world.data.config)],
      () => {
        // TODO: use a proper warning key and don't just dismiss any warning
        this.tools.warningMessage = ''
        for (let levelIndex = 0; levelIndex < this.world.data.levels.length; levelIndex++) {
          if (this.checkLevel(levelIndex)) break
        }
      },
      { deep: true }
    )
    watch(
      [computed(() => this.world.data.levels?.[this.tools.selectedLevel])],
      () => {
        this.tools.warningMessage = ''
        this.checkLevel(this.tools.selectedLevel)
      },
      { deep: true }
    )
  }

  checkLevel(levelIndex: number): boolean {
    console.log('checking if level is valid')
    const level = this.world.data.levels[levelIndex]!
    for (const [layerIndex, layer] of level.layers.entries()) {
      for (const [tileIndex, tileId] of layer.data.entries()) {
        if (this.world.data.config.tiles[tileId] === undefined) {
          const pos = this.levelUtils.indexToPos(level, tileIndex)
          this.tools.warningMessage = `Found invalid tile ID ${tileId} (level ${levelIndex + 1}, layer ${layerIndex + 1}, position ${pos.x}/${pos.y}).`
          return true
        }
      }
    }
    return false
  }
}
