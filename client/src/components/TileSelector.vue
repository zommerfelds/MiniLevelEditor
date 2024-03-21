<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import TilesModal from '@/components/TilesModal.vue'
import type { Tile } from '@common/dataTypes'

const tools = useToolsStore()
const world = useWorldStore()

const iconSize = 22
const tilesetUtils = new TilesetUtils()

function isTileAllowedInSelectedLayer(tile?: Tile): boolean {
  const allowedTypes = world.data.config.layers[tools.selectedLayer]?.allowedTypes
  if (allowedTypes === undefined) return true
  return tile?.types.find((type) => allowedTypes.includes(type)) !== undefined
}

function isTileIndexAllowedInSelectedLayer(tileIndex: number): boolean {
  return isTileAllowedInSelectedLayer(world.data.config?.tileset[tileIndex])
}

watch(
  () => tools.selectedTile,
  () => (tools.lastSelectedTilePerLayer[tools.selectedLayer] = tools.selectedTile)
)

watch(
  () => tools.selectedLayer,
  () => {
    // Make sure that the current selected tile is allowed in this layer.
    if (isTileIndexAllowedInSelectedLayer(tools.selectedTile)) return

    const lastSelectedTile = tools.lastSelectedTilePerLayer[tools.selectedLayer]
    if (lastSelectedTile !== undefined && isTileIndexAllowedInSelectedLayer(lastSelectedTile)) {
      tools.selectedTile = lastSelectedTile
      return
    }
    for (let i = 0; i < world.data.config?.tileset.length; i++) {
      if (isTileIndexAllowedInSelectedLayer(i)) {
        tools.selectedTile = i
        break
      }
    }
  }
)
</script>

<template>
  <div class="container">
    <div class="row pb-2">
      <div class="col pt-2">
        <b>Tiles</b>
      </div>
      <div class="col p-0">
        <button
          class="btn btn-secondary float-end"
          data-bs-toggle="modal"
          data-bs-target="#tilesModal"
        >
          <FontAwesomeIcon :icon="faPen" />
        </button>
      </div>
    </div>
    <div v-if="world.data.config">
      <div class="row" v-for="(tile, index) in world.data.config.tileset" :key="index">
        <div
          class="col pt-1"
          @click="tools.selectedTile = index"
          v-if="isTileAllowedInSelectedLayer(tile)"
        >
          <a
            href="#"
            class="tile-selector"
            :class="tools.selectedTile == index ? 'tile-selected' : ''"
          >
            <div
              class="tile-icon pixelart"
              :style="tilesetUtils.getIconStyle(tile, iconSize)"
            ></div>
            <span class="ps-2 align-top">{{ tile.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <TilesModal />
</template>

<style scoped>
.tile-selector {
  color: rgb(155, 155, 155);
  text-decoration: none;
}

.tile-selected {
  color: rgb(255, 255, 255);
}

.tile-icon {
  display: inline-block;
}
</style>
