<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
const world = useWorldStore()

function addTileType() {
  const newType = { name: '', properties: [] }
  world.data.config.tileTypes.push(newType)

  const dialogBody = document.getElementById('tilesModalBody')!!
  setTimeout(() => dialogBody.scrollTo({ top: dialogBody.scrollHeight, behavior: 'smooth' }), 0)
}

function deleteTileType(index: number) {
  world.data.config.tileTypes.splice(index, 1)
}
</script>

<template v-if="world.data.config">
  <div class="row header pb-3">
    <div class="col-3 ps-3">Name</div>
  </div>
  <div class="row pb-1" v-for="(tileType, index) in world.data.config.tileTypes" :key="index">
    <div class="col-3">
      <input type="text" class="form-control" v-model="tileType.name" />
    </div>
    <div class="col-3">
      <button class="btn btn-sm btn-secondary ms-auto" @click="deleteTileType(index)">
        <FontAwesomeIcon :icon="faTrash" class="" />
      </button>
    </div>
  </div>
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
