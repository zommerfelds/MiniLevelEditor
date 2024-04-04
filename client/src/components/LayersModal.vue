<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import type { LayerConfig, UserDefinedTypeName } from '@common/dataTypes'

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
</script>

<template>
  <div
    class="modal fade text-black"
    id="layersModal"
    tabindex="-1"
    aria-labelledby="layersModalLabel"
    aria-hidden="true"
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
        <div class="modal-body">
          <div class="row header">
            <div class="col-5">Layer Name</div>
            <!-- TODO: add link to tile type editor -->
            <div class="col-7">Allowed Tile Types</div>
          </div>
          <div class="row pt-2">
            <div class="col-5"></div>
            <div class="col">All</div>
            <div class="col" v-for="(tileType, index) in world.data.config.tileTypes" :key="index">
              {{ tileType.name }}
            </div>
          </div>
          <div class="row pt-3" v-for="(layer, index) in world.data.config.layers" :key="index">
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
              v-for="(tileType, index2) in world.data.config.tileTypes"
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
</style>
