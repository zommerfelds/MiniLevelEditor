<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'

const world = useWorldStore()

const iconSize = 30
const tilesetUtils = new TilesetUtils()
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
        <div class="modal-body pb-4">
          <!-- TODO: handle overflow (small window) -->
          <div class="row header pb-3">
            <div class="col-6 ps-3">Name</div>
            <div class="col-6 ps-3">Source</div>
          </div>
          <div v-if="world.data.config">
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
                    {{ tilesetUtils.isEmptyTile(index) ? 'From tileset' : 'Empty' }}
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
                  <div class="size-input">
                    <input type="number" class="form-control" v-model="tile.y" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
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
.header-offset {
  width: 12.5em;
}
</style>
