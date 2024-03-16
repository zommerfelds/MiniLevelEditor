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

const allTileTypesName: UserDefinedTypeName = 'All types'
let selectedTileTypeName = ref(allTileTypesName)

function filterTileset(tileset: Tile[]) {
  if (selectedTileTypeName.value === allTileTypesName) return tileset
  return tileset.filter((t) => t.types.includes(selectedTileTypeName.value))
}

let currentTab = ref('Tiles')
</script>

<template>
  <div
    class="modal fade text-black"
    id="tilesModal"
    tabindex="-1"
    aria-labelledby="tilesModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <template v-if="world.data.config">
        <div class="modal-content">
          <div class="modal-header">
            <ul class="nav nav-pills nav-fill">
              <li
                class="nav-item me-1"
                v-for="(tab, index) in ['Tiles', 'Types']"
                v-bind:key="index"
              >
                <a
                  class="nav-link"
                  :class="currentTab === tab ? 'active' : ''"
                  aria-current="page"
                  href="#"
                  @click="currentTab = tab"
                >
                  {{ tab }}
                </a>
              </li>
            </ul>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div id="tilesModalBody" class="modal-body pb-4 my-modal-body">
            <!-- TODO: create a dropdown vue element (refactor) -->

            <template v-if="currentTab === 'Tiles'">
              <div class="row"></div>
              <div class="row header pb-3">
                <div class="col-3 ps-3">Name</div>
                <div class="col-3 ps-3">Type(s)</div>
                <div class="col-4 ps-3">Source</div>
                <div class="col-2">
                  <div class="dropdown float-end">
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
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="selectedTileTypeName = allTileTypesName"
                          >{{ allTileTypesName }}
                        </a>
                      </li>
                      <li v-for="(tileType, index) in world.data.config.tileTypes" :key="index">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="selectedTileTypeName = tileType.name"
                        >
                          {{ tileType.name }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
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
                    <div
                      class="tile-icon pixelart"
                      :style="tilesetUtils.getIconStyle(tile, iconSize)"
                    ></div>
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
                        <a class="dropdown-item" href="#" @click="tilesetUtils.setEmpty(tile)">
                          Empty
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="tilesetUtils.setFromTileset(tile, 0, 0)"
                        >
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
            <template v-if="currentTab === 'Types'"> TODO </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.my-modal-body {
  height: 80vh;
  overflow-y: auto;
}
.size-input {
  width: 5em;
}
.header {
  font-weight: bold;
}
.header-offset {
  width: 12.5em;
}
</style>
