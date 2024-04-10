import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { computed, watch } from 'vue'
import { LevelUtils } from './LevelUtils'

export class LevelChecker {
  world = useWorldStore()
  tools = useToolsStore()
  levelUtils = new LevelUtils()

  // TODO: level probably is being checked too often. Check logs.
  watch() {
    watch(
      [computed(() => (this.world.isLoaded ? this.world.getWorldData().config : undefined))],
      () => {
        // TODO: use a proper warning key and don't just dismiss any warning
        this.tools.warningMessage = ''
        for (
          let levelIndex = 0;
          levelIndex < this.world.getWorldData().levels.length;
          levelIndex++
        ) {
          if (this.checkLevel(levelIndex)) break
        }
      },
      { deep: true }
    )
    watch(
      [
        computed(() =>
          this.world.isLoaded
            ? this.world.getWorldData().levels[this.tools.selectedLevel]
            : undefined
        ),
      ],
      () => {
        this.tools.warningMessage = ''
        this.checkLevel(this.tools.selectedLevel)
      },
      { deep: true }
    )
  }

  checkLevel(levelIndex: number): boolean {
    console.log('Checking if level is valid')
    const level = this.world.getWorldData().levels[levelIndex]!
    for (const [layerIndex, layer] of level.layers.entries()) {
      for (const [tileIndex, tileId] of layer.data.entries()) {
        if (tileId !== -1 && this.world.getWorldData().config.tileset[tileId] === undefined) {
          const pos = this.levelUtils.indexToPos(level, tileIndex)
          this.tools.warningMessage = `Found invalid tile ID ${tileId} (level ${levelIndex + 1}, layer ${layerIndex + 1}, position ${pos.x}/${pos.y}).`
          return true
        }
      }
    }
    return false
  }
}
