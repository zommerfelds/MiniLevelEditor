<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { launch } from '@/phaser/phaser-main'

onMounted(() => {
  const phaserInstance = launch('phaser-game')
  onUnmounted(() => {
    phaserInstance.destroy(true)
  })
})
</script>

<template>
    <div id="phaser-game" class="w-100" style="overflow: hidden" @contextmenu.prevent=""></div>
</template>
