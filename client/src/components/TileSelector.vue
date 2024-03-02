<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'

const tools = useToolsStore()
const world = useWorldStore()
</script>

<template>
  <div class="container" v-for="i in 4" :key="i">
    <div class="row pb-1" @click="tools.selectedTile = i">
      <div class="col">
        <a href="#" class="tile-selector" :class="tools.selectedTile == i ? 'tile-selected' : ''">
          <!-- img :src="'api/tilesets/tileset1.png'" class="pe-2 tile-img" / -->
          <div class="tile-icon pixelart"></div>
          <span class="ps-2">Tile {{ i }}</span>
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

.tile-img {
  width: 2.5em;
  clip-path: inset(0px 0px 16px 16px);
}

.tile-icon {
  display: inline-block;
  background-image: url('api/tilesets/tileset1.png');
  background-position: 0px 16px;
  background-size: 32px;
  width: 16px;
  height: 16px;
}
</style>
