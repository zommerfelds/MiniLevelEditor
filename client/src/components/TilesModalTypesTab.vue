<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import type {
  PropertySchemaEntry,
  PropertySchemaTypeName,
  UserDefinedType,
} from '@common/dataTypes'
import MyDropdown from '@/components/MyDropdown.vue'
const world = useWorldStore()

function addTileType() {
  const newType: UserDefinedType = { name: '', properties: [] }
  world.getWorldData().config.tileTypes.push(newType)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}

function deleteTileType(index: number) {
  world.getWorldData().config.tileTypes.splice(index, 1)
}

function addTileTypeProp(tileType: UserDefinedType) {
  const newProp: PropertySchemaEntry = {
    key: 'key',
    defaultBool: false,
    type: 'Bool',
    optional: false,
  }
  tileType.properties.push(newProp)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}
function deleteTileTypeProp(tileType: UserDefinedType, index: number) {
  tileType.properties.splice(index, 1)
}

function setPropType(prop: PropertySchemaEntry, type: PropertySchemaTypeName) {
  if (prop.type === type) return // Don't reset anything.
  prop.type = type
  const propAny: any = prop // Avoid type check.
  if (prop.type !== 'Bool') delete propAny.defaultBool
  if (prop.type !== 'Float') delete propAny.defaultFloat
  if (prop.type !== 'Int') delete propAny.defaultInt
  if (prop.type !== 'String') delete propAny.defaultString
  if (prop.type !== 'Position') delete propAny.defaultPosition
  switch (prop.type) {
    case 'Bool':
      prop.defaultBool = false
      break
    case 'Float':
      prop.defaultFloat = 0.0
      break
    case 'Int':
      prop.defaultInt = 0
      break
    case 'String':
      prop.defaultString = ''
      break
    case 'Position':
      prop.defaultPosition = { x: 0, y: 0 }
      break
  }
}
</script>

<template v-if="world.data.config">
  <!-- TODO: this UI is a bit shitty, improve it to something like a sidebar selector -->
  <div class="row header pb-1">
    <div class="col-3 ps-3">Name</div>
    <div class="col-3 ps-3">Properties</div>
  </div>
  <div class="row pb-1">
    <div class="col-3"></div>
    <div class="col-8">
      <div class="row">
        <div class="col ps-3">Key</div>
        <div class="col-3 ps-3">Type</div>
        <div class="col ps-3">Default</div>
        <div class="col-1 ps-3">Optional</div>
        <div class="col-1"></div>
      </div>
    </div>
  </div>
  <template v-for="(tileType, index) in world.getWorldData().config.tileTypes" :key="index">
    <div class="row ps-1 pe-1 pt-2"><hr /></div>
    <div class="row pb-1">
      <div class="col-3">
        <input type="text" class="form-control" v-model="tileType.name" />
      </div>
      <div class="col-8">
        <div class="row pb-1" v-for="(prop, index2) in tileType.properties" :key="index2">
          <div class="col">
            <input type="text" class="form-control" v-model="prop.key" />
          </div>
          <div class="col-3">
            <MyDropdown
              :list="[
                { value: 'String', onclick: () => setPropType(prop, 'String') },
                { value: 'Bool', onclick: () => setPropType(prop, 'Bool') },
                { value: 'Int', onclick: () => setPropType(prop, 'Int') },
                { value: 'Float', onclick: () => setPropType(prop, 'Float') },
                { value: 'Position', onclick: () => setPropType(prop, 'Position') },
              ]"
              v-model="prop.type"
              fill-width
            />
          </div>
          <div class="col">
            <div v-if="prop.type === 'String'">
              <input type="text" class="form-control" v-model="prop.defaultString" />
            </div>
            <div v-if="prop.type === 'Int'">
              <input type="number" class="form-control" step="1" v-model="prop.defaultInt" />
            </div>
            <div v-if="prop.type === 'Float'">
              <input type="number" class="form-control" v-model="prop.defaultFloat" />
            </div>
            <div v-if="prop.type === 'Bool'">
              <MyDropdown :list="[true, false]" v-model="prop.defaultBool" fill-width />
            </div>
            <div v-if="prop.type === 'Position'">
              <div class="row">
                <div class="col p-0 pe-1">
                  <input type="number" class="form-control" v-model="prop.defaultPosition.x" />
                </div>
                <div class="col p-0">
                  <input type="number" class="form-control" v-model="prop.defaultPosition.y" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-1">
            <input class="form-check-input" type="checkbox" v-model="prop.optional" />
          </div>
          <div class="col-1">
            <button
              class="btn btn-sm btn-secondary ms-auto"
              @click="deleteTileTypeProp(tileType, index2)"
            >
              <FontAwesomeIcon :icon="faTrash" class="" />
            </button>
          </div>
        </div>
        <div class="row pt-1">
          <div class="col">
            <button class="btn btn-sm btn-secondary" @click="addTileTypeProp(tileType)">
              <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add property
            </button>
          </div>
        </div>
      </div>
      <div class="col-1">
        <button class="btn btn-sm btn-secondary ms-auto h-100" @click="deleteTileType(index)">
          <FontAwesomeIcon :icon="faTrash" class="" />
        </button>
      </div>
    </div>
  </template>
  <div class="row ps-1 pe-1 pt-2"><hr /></div>
  <div class="row pt-2">
    <div class="col">
      <button class="btn btn-sm btn-secondary" @click="addTileType()">
        <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add type
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  font-weight: bold;
}
</style>
