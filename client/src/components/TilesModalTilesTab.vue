<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { TilesetUtils } from '@/logic/TilesetUtils'
import MyDropdown from '@/components/MyDropdown.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTrash,
  faSquarePlus,
  faAnglesDown,
  faAnglesUp,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import type { Position, PropertySchema, Tile, UserDefinedTypeName } from '@common/dataTypes'
import { ref, computed } from 'vue'

const world = useWorldStore()

const iconSize = 30
const tilesetUtils = new TilesetUtils()

function addTile() {
  const newTile = { name: '', types: [], properties: {} }
  world.getWorldData().config.tileset.push(newTile)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}

function deleteTile(index: number) {
  world.getWorldData().config.tileset.splice(index, 1)
}

const allTileTypesName: UserDefinedTypeName = 'Show all types'
let selectedTileTypeName = ref(allTileTypesName)

function filterTileset(tileset: Tile[]) {
  if (selectedTileTypeName.value === allTileTypesName) return tileset
  return tileset.filter((t) => t.types.includes(selectedTileTypeName.value))
}

let showPropertiesForIndex = ref(-1)

const typeMap = computed(() => {
  const map: { [key: UserDefinedTypeName]: PropertySchema } = {}
  if (!world.isLoaded) return map
  for (const type of world.getWorldData().config.tileTypes) {
    map[type.name] = type.properties
  }
  return map
})
</script>

<template>
  <template v-if="world.isLoaded">
    <div class="row mb-2">
      <MyDropdown
        :list="[allTileTypesName].concat(world.getWorldData().config.tileTypes.map((t) => t.name))"
        v-model="selectedTileTypeName"
      />
    </div>
    <div class="row header pb-3">
      <div class="col-3 ps-3">Name</div>
      <div class="col-4 ps-3">Type(s)</div>
      <div class="col-5 ps-3">Source</div>
    </div>
    <template
      v-for="(tile, tileIndex) in filterTileset(world.getWorldData().config.tileset)"
      :key="tileIndex"
    >
      <div class="row pb-1">
        <div class="col-3">
          <input type="text" class="form-control" v-model="tile.name" />
        </div>
        <div class="col-3 pt-1 ps-3">
          <template v-for="(type, typeIndex) in tile.types" :key="typeIndex">
            <span
              class="badge rounded-pill ps-3 me-1 bg-secondary d-inline-flex align-items-center justify-content-center"
            >
              <!-- consider refactoring this into a separate component -->
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-secondary p-0"
                  @click="console.log('not implemented')"
                  :id="'dropdown_' + tileIndex + '_' + typeIndex"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ type }}
                </button>
                <ul
                  class="dropdown-menu"
                  :aria-labelledby="'dropdown_' + tileIndex + '_' + typeIndex"
                >
                  <template
                    v-for="(availableType, allTypesIndex) in world.getWorldData().config.tileTypes"
                    :key="allTypesIndex"
                  >
                    <li v-if="availableType.name != type">
                      <a class="dropdown-item" href="#" @click="console.log('not implemented')">{{
                        availableType.name
                      }}</a>
                    </li>
                  </template>
                </ul>
              </div>
              <button href="#" class="btn btn-sm p-0 text-white ms-2">
                <FontAwesomeIcon :icon="faTimesCircle" />
              </button>
            </span>
          </template>
          <span class="p-1"></span>
          <span class="dropdown align-text-top">
            <button
              class="btn text-secondary p-0"
              @click="console.log('not implemented')"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :id="'dropdown_' + tileIndex + '_add'"
            >
              <FontAwesomeIcon :icon="faSquarePlus" />
            </button>
            <ul class="dropdown-menu" :aria-labelledby="'dropdown_' + tileIndex + '_add'">
              <template
                v-for="(availableType, allTypesIndex) in world.getWorldData().config.tileTypes"
                :key="allTypesIndex"
              >
                <li v-if="!tile.types.includes(availableType.name)">
                  <a class="dropdown-item" href="#" @click="console.log('not implemented!')">{{
                    availableType.name
                  }}</a>
                </li>
              </template>
            </ul>
          </span>
        </div>
        <div class="col-6 d-flex">
          <div class="pe-2 pt-1">
            <div
              class="tile-icon pixelart"
              :style="tilesetUtils.getIconStyle(tile, iconSize)"
            ></div>
          </div>
          <MyDropdown
            :list="[
              { value: 'Empty', onclick: () => tilesetUtils.setEmpty(tile) },
              { value: 'From tileset', onclick: () => tilesetUtils.setFromTileset(tile, 0, 0) },
            ]"
            :default="tilesetUtils.isEmptyTileIndex(tileIndex) ? 'Empty' : 'From tileset'"
          />
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
          <button
            class="btn btn-sm btn-secondary ms-auto me-1"
            @click="
              showPropertiesForIndex === tileIndex
                ? (showPropertiesForIndex = -1)
                : (showPropertiesForIndex = tileIndex)
            "
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-delay='{"show":2000, "hide":1000}'
            title="Show/hide properties"
          >
            <FontAwesomeIcon
              :icon="showPropertiesForIndex === tileIndex ? faAnglesUp : faAnglesDown"
              class=""
            />
          </button>
          <button class="btn btn-sm btn-secondary ms-auto" @click="deleteTile(tileIndex)">
            <FontAwesomeIcon :icon="faTrash" />
          </button>
        </div>
      </div>
      <div class="row pb-3" v-if="tileIndex === showPropertiesForIndex">
        <template v-for="(typeName, index3) in tile.types" :key="index3">
          <div class="row">
            <div class="col-1"></div>
            <div class="col p-2">
              <b>"{{ typeName }}" properties</b>
            </div>
          </div>
          <template v-for="(schema, index4) in typeMap[typeName]" :key="index4">
            <div class="row">
              <div class="col-1"></div>
              <div class="col-1 p-2">{{ schema.key }}</div>
              <div class="col-3">
                <template v-if="schema.type === 'String'">
                  <input type="text" class="form-control" v-model="tile.properties[schema.key]" />
                </template>
                <template v-if="schema.type === 'Int'">
                  <input
                    type="number"
                    class="form-control"
                    step="1"
                    v-model="tile.properties[schema.key]"
                  />
                </template>
                <template v-if="schema.type === 'Float'">
                  <input type="number" class="form-control" v-model="tile.properties[schema.key]" />
                </template>
                <template v-if="schema.type === 'Bool'">
                  <MyDropdown :list="[true, false]" v-model="tile.properties[schema.key]" />
                </template>
                <template v-if="schema.type === 'Position'">
                  <div class="row">
                    <div class="col p-0 pe-1">
                      <input
                        type="number"
                        class="form-control"
                        v-model="(tile.properties[schema.key] as Position).x"
                      />
                    </div>
                    <div class="col p-0">
                      <input
                        type="number"
                        class="form-control"
                        v-model="(tile.properties[schema.key] as Position).y"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
    <div class="row pt-2">
      <div class="col">
        <button class="btn btn-sm btn-secondary" @click="addTile()">
          <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add tile
        </button>
      </div>
    </div>
  </template>
</template>

<style scoped>
.size-input {
  width: 5em;
  min-width: 5em;
}
.header {
  font-weight: bold;
}
.dropdown-translate-left {
  position: relative;
  left: -2em;
}
</style>
