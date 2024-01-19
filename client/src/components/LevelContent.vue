<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { computed } from 'vue'

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
</script>

<template>
  <textarea class="span6 w-100 h-100 text-white bg-dark p-3" v-model="message"></textarea>
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
