<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { watch } from 'vue'

const tools = useToolsStore()
const world = useWorldStore()

const tileSize = 16
const imageSize = 64
const iconSize = 22
const backgroundSize = imageSize * (iconSize / tileSize)

const tilesetUtils = new TilesetUtils()

function getIconStyle(tile: any) {
  if (tile.x == undefined) {
    return { 'background-color': 'black' }
  }
  return {
    'background-position':
      iconSize * (-tile.x / tileSize) + 'px ' + iconSize * (-tile.y / tileSize) + 'px',
    'background-image': 'url("' + tilesetUtils.getPath() + '")',
    'background-size': backgroundSize + 'px',
  }
}

function isTileAllowedInSelectedLayer(tile: any): boolean {
  return tile?.allowedLayers?.includes(tools.selectedLayer) ?? true
}

function isTileIndexAllowedInSelectedLayer(tileIndex: number): boolean {
  return isTileAllowedInSelectedLayer(world.data.config?.tiles[tileIndex])
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

    if (
      tools.lastSelectedTilePerLayer[tools.selectedLayer] != undefined &&
      isTileIndexAllowedInSelectedLayer(tools.lastSelectedTilePerLayer[tools.selectedLayer])
    ) {
      tools.selectedTile = tools.lastSelectedTilePerLayer[tools.selectedLayer]
      return
    }
    for (let i = 0; i < world.data.config?.tiles.length; i++) {
      if (isTileIndexAllowedInSelectedLayer(i)) {
        tools.selectedTile = i
        break
      }
    }
  }
)
</script>

<template>
  <div v-if="world.data.config">
    <div class="container" v-for="(tile, index) in world.data.config.tiles" :key="index">
      <div
        class="row pb-1"
        @click="tools.selectedTile = index"
        v-if="isTileAllowedInSelectedLayer(tile)"
      >
        <div class="col">
          <a
            href="#"
            class="tile-selector"
            :class="tools.selectedTile == index ? 'tile-selected' : ''"
          >
            <div class="tile-icon pixelart" :style="getIconStyle(tile)"></div>
            <span class="ps-2 align-top">{{ tile.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
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
  width: v-bind(iconSize + 'px');
  height: v-bind(iconSize + 'px');
}
</style>
