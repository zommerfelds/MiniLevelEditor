<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import type { LayerConfig, UserDefinedTypeName } from '@common/dataTypes'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

const world = useWorldStore()

function isTypeAllowed(layer: LayerConfig, typeName: UserDefinedTypeName): boolean {
  if (layer.allowedTypes === undefined) return true
  return layer.allowedTypes.includes(typeName)
}

function isAllTypeAllowed(layer: LayerConfig): boolean {
  return layer.allowedTypes === undefined
}

function clickCheckbox(layer: LayerConfig, typeName: UserDefinedTypeName) {
  if (layer.allowedTypes === undefined) return

  const index = layer.allowedTypes.indexOf(typeName) ?? -1
  if (index !== -1) {
    layer.allowedTypes!.splice(index, 1)
  } else {
    layer.allowedTypes.push(typeName)
  }
}

function clickAllCheckbox(layer: LayerConfig) {
  if (layer.allowedTypes === undefined) {
    layer.allowedTypes = []
  } else {
    layer.allowedTypes = undefined
  }
}

let layersModalBody = ref<HTMLElement | undefined>(undefined)

function addLayer() {
  const newLayer: LayerConfig = { name: 'New layer' }
  world.getWorldData().config.layers.push(newLayer)

  setTimeout(
    () =>
      layersModalBody.value!.scrollTo({
        top: layersModalBody.value!.scrollHeight,
        behavior: 'smooth',
      }),
    0
  )
}

function deleteLayer(index: number) {
  world.getWorldData().config.layers.splice(index, 1)
}
</script>

<template>
  <div
    class="modal fade text-black"
    id="layersModal"
    tabindex="-1"
    aria-labelledby="layersModalLabel"
    aria-hidden="true"
    v-if="world.isLoaded"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="layersModalLabel">Layers</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div ref="layersModalBody" class="modal-body my-modal-body">
          <div class="row header">
            <div class="col-5">Layer Name</div>
            <!-- TODO: add link to tile type editor -->
            <div class="col-7">Allowed Tile Types</div>
          </div>
          <div class="row pt-2">
            <div class="col-5"></div>
            <div class="col">All</div>
            <div
              class="col"
              v-for="(tileType, index) in world.getWorldData().config.tileTypes"
              :key="index"
            >
              {{ tileType.name }}
            </div>
            <div class="col-1"></div>
          </div>
          <div
            class="row pt-3"
            v-for="(layer, index) in world.getWorldData().config.layers"
            :key="index"
          >
            <div class="col-5">
              <input type="text" class="form-control" v-model="layer.name" />
            </div>

            <div class="col">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="isAllTypeAllowed(layer)"
                @click="clickAllCheckbox(layer)"
              />
            </div>
            <div
              class="col"
              v-for="(tileType, index2) in world.getWorldData().config.tileTypes"
              :key="index2"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :checked="isTypeAllowed(layer, tileType.name)"
                @click="clickCheckbox(layer, tileType.name)"
                :disabled="layer.allowedTypes === undefined"
              />
            </div>
            <div class="col-1">
              <button class="btn btn-sm btn-secondary ms-auto" @click="deleteLayer(index)">
                <FontAwesomeIcon :icon="faTrash" />
              </button>
            </div>
          </div>
          <div class="row pt-3">
            <div class="col">
              <button class="btn btn-sm btn-secondary" @click="addLayer()">
                <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add layer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  font-weight: bold;
}

.my-modal-body {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
