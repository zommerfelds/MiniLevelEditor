<script setup lang="ts">
import LayersModal from '@/components/LayersModal.vue'
import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faReply,
  faShare,
  faPen,
  faArrowPointer,
  faTriangleExclamation,
  faEraser,
  faUpDownLeftRight,
} from '@fortawesome/free-solid-svg-icons'

const tools = useToolsStore()
const world = useWorldStore()
</script>

<template>
  <div class="p-3 bg-dark text-light border-bottom border-secondary" v-if="world.isLoaded">
    <div class="d-flex align-items-end global-toolbar-height">
      <div class="p-2">Undo</div>
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-light"
          data-toggle="button"
          :disabled="!world.canUndo"
          @click="world.undo"
        >
          <FontAwesomeIcon :icon="faReply" />
        </button>
        <button
          type="button"
          class="btn btn-light"
          data-toggle="button"
          :disabled="!world.canRedo"
          @click="world.redo"
        >
          <FontAwesomeIcon :icon="faShare" />
        </button>
      </div>

      <div class="p-2 ms-3">Tool</div>
      <!-- TODO: add tooltip -->
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Pan ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Pan"
        >
          <FontAwesomeIcon :icon="faArrowPointer" />
        </button>
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Draw ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Draw"
        >
          <FontAwesomeIcon :icon="faPen" />
        </button>
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Erase ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Erase"
        >
          <FontAwesomeIcon :icon="faEraser" />
        </button>
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Move ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Move"
        >
          <FontAwesomeIcon :icon="faUpDownLeftRight" />
        </button>
      </div>

      <template v-if="tools.selectedTool === Tool.Move">
        <div class="p-2 ms-3">Tool options</div>
        <div class="list-group list-group-horizontal">
          <div class="list-group-item">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="tools.toolOptionMoveSwap"
              id="toolOptionMoveSwap"
            />
            <label class="form-check-label ps-1" for="toolOptionMoveSwap"> Swap </label>
          </div>
        </div>
      </template>

      <!-- TODO: replace this with a full layer UI -->
      <div class="p-2 ms-3">Layer</div>
      <div class="btn-group" role="group">
        <button
          v-for="(layer, index) in world.getWorldData().config.layers"
          :key="index"
          type="button"
          class="btn"
          :class="tools.selectedLayer == index ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedLayer = index"
        >
          {{ layer.name }}
        </button>
      </div>
      <div class="p-2">
        <a href="#" class="text-white" data-bs-toggle="modal" data-bs-target="#layersModal">
          <FontAwesomeIcon :icon="faPen"
        /></a>
      </div>
    </div>
  </div>
  <div>
    <div
      class="p-2 bg-warning warning-bar border-bottom border-end border-secondary"
      v-if="tools.warningMessage"
    >
      <FontAwesomeIcon :icon="faTriangleExclamation" class="me-2" />
      {{ tools.warningMessage }}
    </div>
  </div>

  <LayersModal />
</template>

<style scoped>
.warning-bar {
  position: fixed;
}
</style>
