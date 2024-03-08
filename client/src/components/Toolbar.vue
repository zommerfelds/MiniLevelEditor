<script setup lang="ts">
import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faReply, faShare, faPen, faArrowPointer } from '@fortawesome/free-solid-svg-icons'

const tools = useToolsStore()
const world = useWorldStore()
</script>

<template>
  <div class="p-3 bg-dark text-light border-bottom border-secondary" v-if="world.data.config">
    <div class="d-flex align-items-end global-toolbar-height">
      <div class="p-2">Undo</div>
      <div class="btn-group" role="group">
        <button disabled type="button" class="btn btn-light" data-toggle="button">
          <FontAwesomeIcon :icon="faReply" />
        </button>
        <button disabled type="button" class="btn btn-light" data-toggle="button">
          <FontAwesomeIcon :icon="faShare" />
        </button>
      </div>

      <div class="p-2 ms-3">Tool</div>
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Move ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Move"
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
      </div>

      <!-- TODO: replace this with a full layer UI -->
      <div class="p-2 ms-3">Layer</div>
      <div class="btn-group" role="group">
        <button
          v-for="(layer, index) in world.data.config.layers"
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
    </div>
  </div>
</template>
