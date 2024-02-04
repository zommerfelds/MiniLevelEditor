<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { computed, onMounted, onUnmounted } from 'vue'
import { launch } from '@/phaser/phaser-main'
import { useToolsStore, Tool } from '@/stores/tools'

const props = defineProps<{ level: number }>()
const store = useWorldStore()
const tools = useToolsStore()

const message = computed({
  get() {
    return JSON.stringify(store.levels[props.level])
  },
  set(val) {
    let parsed = undefined
    try {
      parsed = JSON.parse(val)
    } catch (err) {
      return
    }
    store.levels[props.level] = parsed
  },
})

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
    <!--textarea class="span6 w-100 text-white bg-dark p-3" v-model="message"></textarea-->
    <div id="phaser-game" class="w-100" style="overflow: hidden"></div>
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
