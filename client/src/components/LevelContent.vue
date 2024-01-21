<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { computed, onMounted, onUnmounted } from 'vue'
import { launch } from '@/phaser/phaser-main'

const props = defineProps<{ level: number }>()
const store = useWorldStore()

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
  }
})

onMounted(() => {
  const phaserInstance = launch('phaser-game')
  onUnmounted(() => {
    phaserInstance.destroy(true)
  })
})
</script>

<template>
  <textarea class="span6 w-100 h-25 text-white bg-dark p-3" v-model="message"></textarea>
  <div id="phaser-game" class="w-100 h-75"></div>
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
