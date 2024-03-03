<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'

const tools = useToolsStore()
const world = useWorldStore()

const tileSize = 16
const imageSize = 64

const iconSize = 22
const backgroundSize = imageSize * (iconSize / tileSize)
</script>

<template>
  <!-- TODO: use tiles from config like in LevelContent.vue -->
  <div class="container" v-for="i in 4" :key="i">
    <div class="row pb-1" @click="tools.selectedTile = i">
      <div class="col">
        <a href="#" class="tile-selector" :class="tools.selectedTile == i ? 'tile-selected' : ''">
          <div
            class="tile-icon pixelart"
            :style="'background-position: ' + iconSize * (-i + 1) + 'px 0px;'"
          ></div>
          <span class="ps-2 align-top">Tile {{ i }}</span>
        </a>
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
  background-image: url('api/tilesets/tileset1.png');
  background-size: v-bind(backgroundSize + 'px');
  width: v-bind(iconSize + 'px');
  height: v-bind(iconSize + 'px');
}
</style>
