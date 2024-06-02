<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { launch } from '@/phaser/phaser-main'
import { Tool, useToolsStore } from '@/stores/tools'

const tools = useToolsStore()

onMounted(() => {
  const phaserInstance = launch('phaser-game')
  onUnmounted(() => {
    phaserInstance.destroy(true)
  })
})

const cursor = computed(() => {
  switch (tools.selectedTool) {
    case Tool.Select:
      return 'crosshair'
    case Tool.Move:
      return 'move'
    default:
      return 'default'
  }
})
</script>

<template>
  <div
    id="phaser-game"
    class="w-100"
    style="overflow: hidden"
    :style="{ cursor: cursor }"
    @contextmenu.prevent=""
  ></div>
</template>
