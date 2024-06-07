<script setup lang="ts">
import LayersModal from '@/components/LayersModal.vue'
import TopToolbarToolButton from '@/components/TopToolbarToolButton.vue'
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
  faVectorSquare,
} from '@fortawesome/free-solid-svg-icons'
import { watchEffect } from 'vue'

const tools = useToolsStore()
const world = useWorldStore()

watchEffect(() => {
  const warnText = 'Selection tool not fully implemented yet'
  if (tools.selectedTool === Tool.Select) {
    tools.warningMessage = warnText
  } else if (tools.warningMessage === warnText) {
    tools.warningMessage = ''
  }
})
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
      <div class="btn-group" role="group">
        <TopToolbarToolButton
          :tool="Tool.Pan"
          :icon="faArrowPointer"
          tooltipText="Pan tool (drag camera)"
        />

        <TopToolbarToolButton :tool="Tool.Draw" :icon="faPen" tooltipText="Draw tool" />
        <TopToolbarToolButton :tool="Tool.Erase" :icon="faEraser" tooltipText="Erase tool" />
        <TopToolbarToolButton
          :tool="Tool.Move"
          :icon="faUpDownLeftRight"
          tooltipText="Tile mover tool"
        />
        <TopToolbarToolButton
          :tool="Tool.Select"
          :icon="faVectorSquare"
          tooltipText="Selection tool"
        />
      </div>

      <template v-if="tools.selectedTool === Tool.Move">
        <div class="p-2 ms-3 text-nowrap">Tool options</div>
        <div class="list-group list-group-horizontal text-nowrap">
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
      <template v-if="tools.selectedTool === Tool.Select">
        <div class="p-2 ms-3 text-nowrap">Tool options</div>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-light"
            data-toggle="button"
            @click="tools.selectionToolRect = undefined"
          >
            Deselect all
          </button>
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
