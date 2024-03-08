<script setup lang="ts">
import { useToolsStore, Tool } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'

const tools = useToolsStore()
const world = useWorldStore()
</script>

<template>
  <div
    class="p-2 bg-dark text-light d-flex border-bottom border-secondary"
    v-if="world.data.config"
  >
    <div class="p-2">Tool</div>
    <div class="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        class="btn"
        :class="tools.selectedTool == Tool.Move ? 'btn-success' : 'btn-light'"
        data-toggle="button"
        @click="tools.selectedTool = Tool.Move"
      >
        <i class="bi bi-eye-fill"></i>
      </button>
      <button
        type="button"
        class="btn"
        :class="tools.selectedTool == Tool.Draw ? 'btn-success' : 'btn-light'"
        data-toggle="button"
        @click="tools.selectedTool = Tool.Draw"
      >
        <i class="bi bi-pencil-fill"></i>
      </button>
      <!--
          <i class="bi bi-cursor-fill"></i><i class="bi bi-hand-index"></i>
          <i class="bi bi-eraser-fill"></i>
          <i class="bi bi-arrows-move"></i>
          <i class="bi bi-bounding-box-circles"></i>
        -->
    </div>

    <!-- TODO: replace this with a full layer UI -->
    <div class="p-2 ms-3">Layer</div>
    <div class="btn-group" role="group" aria-label="Basic example">
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
</template>
