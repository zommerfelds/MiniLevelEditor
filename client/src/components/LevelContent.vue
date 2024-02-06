<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { launch } from '@/phaser/phaser-main'
import { useToolsStore, Tool } from '@/stores/tools'

const tools = useToolsStore()

onMounted(() => {
  const phaserInstance = launch('phaser-game')
  onUnmounted(() => {
    phaserInstance.destroy(true)
  })
})
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div class="p-2 bg-dark text-light d-flex">
      <div class="p-2">Tile</div>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button
          v-for="i in 4"
          :key="i"
          type="button"
          class="btn"
          :class="tools.selectedTile == i ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTile = i"
        >
          {{ i }}
        </button>
      </div>
      <div class="p-2 ms-3">Tool</div>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Move ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Move"
        >
          Move
        </button>
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Draw ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Draw"
        >
          Draw
        </button>
        <button
          type="button"
          class="btn"
          :class="tools.selectedTool == Tool.Erase ? 'btn-success' : 'btn-light'"
          data-toggle="button"
          @click="tools.selectedTool = Tool.Erase"
        >
          Erase
        </button>
      </div>
    </div>
    <div id="phaser-game" class="w-100" style="overflow: hidden" @contextmenu.prevent=""></div>
  </div>
</template>

<style scoped>
textarea {
  border-style: none;
  border-color: Transparent;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
}
</style>
