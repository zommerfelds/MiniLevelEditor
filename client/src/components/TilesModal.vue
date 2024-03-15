<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

const world = useWorldStore()

const iconSize = 30
const tilesetUtils = new TilesetUtils()

function addTile() {
  const newTile = { name: '' }
  world.data.config.tiles.push(newTile)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}

function deleteTile(index: number) {
  world.data.config.tiles.splice(index, 1)
}
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
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="tilesModalLabel">Tiles</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div id="tilesModalBody" class="modal-body pb-4 my-modal-body">
          <!-- TODO: handle overflow (small window) -->
          <div class="row header pb-3">
            <div class="col-6 ps-3">Name</div>
            <div class="col-6 ps-3">Source</div>
          </div>
          <template v-if="world.data.config">
            <div class="row pb-1" v-for="(tile, index) in world.data.config.tiles" :key="index">
              <div class="col-6 d-flex">
                <input type="text" class="form-control" v-model="tile.name" />
              </div>
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
                    {{ tilesetUtils.isEmptyTile(index) ? 'Empty' : 'From tileset' }}
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
        </div>
      </div>
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
