<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import type { Tile, UserDefinedTypeName } from '@common/dataTypes'
import { ref } from 'vue'

const world = useWorldStore()

const iconSize = 30
const tilesetUtils = new TilesetUtils()

function addTile() {
  const newTile = { name: '', types: [] }
  world.data.config.tileset.push(newTile)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}

function deleteTile(index: number) {
  world.data.config.tileset.splice(index, 1)
}

const allTileTypesName: UserDefinedTypeName = 'Show all types'
let selectedTileTypeName = ref(allTileTypesName)

function filterTileset(tileset: Tile[]) {
  if (selectedTileTypeName.value === allTileTypesName) return tileset
  return tileset.filter((t) => t.types.includes(selectedTileTypeName.value))
}
</script>

<template v-if="world.data.config">
  <div class="row mb-2">
    <div class="dropdown">
      <button
        class="btn btn-light dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ selectedTileTypeName }}
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" href="#" @click="selectedTileTypeName = allTileTypesName"
            >{{ allTileTypesName }}
          </a>
        </li>
        <li v-for="(tileType, index) in world.data.config.tileTypes" :key="index">
          <a class="dropdown-item" href="#" @click="selectedTileTypeName = tileType.name">
            {{ tileType.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row header pb-3">
    <div class="col-3 ps-3">Name</div>
    <div class="col-3 ps-3">Type(s)</div>
    <div class="col-6 ps-3">Source</div>
  </div>
  <div
    class="row pb-1"
    v-for="(tile, index) in filterTileset(world.data.config.tileset)"
    :key="index"
  >
    <div class="col-3">
      <input type="text" class="form-control" v-model="tile.name" />
    </div>
    <div class="col-3 pt-1 ps-3">{{ tile.types.join(', ') }}</div>
    <div class="col-6 d-flex">
      <div class="pe-2 pt-1">
        <div class="tile-icon pixelart" :style="tilesetUtils.getIconStyle(tile, iconSize)"></div>
      </div>
      <div class="dropdown">
        <button
          class="btn btn-light dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ tilesetUtils.isEmptyTileIndex(index) ? 'Empty' : 'From tileset' }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#" @click="tilesetUtils.setEmpty(tile)"> Empty </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="tilesetUtils.setFromTileset(tile, 0, 0)">
              From tileset
            </a>
          </li>
        </ul>
      </div>
      <template v-if="tile.x != undefined">
        <div class="p-1 ps-3">x:</div>
        <div class="size-input">
          <input type="number" class="form-control" v-model="tile.x" />
        </div>
        <div class="p-1">y:</div>
        <div class="size-input me-2">
          <input type="number" class="form-control" v-model="tile.y" />
        </div>
      </template>
      <button class="btn btn-sm btn-secondary ms-auto" @click="deleteTile(index)">
        <FontAwesomeIcon :icon="faTrash" class="" />
      </button>
    </div>
  </div>
  <div class="row pt-2">
    <div class="col">
      <button class="btn btn-sm btn-secondary" @click="addTile()">
        <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add tile
      </button>
    </div>
  </div>
</template>

<style scoped>
.size-input {
  width: 5em;
}
.header {
  font-weight: bold;
}
</style>
