import { ref } from 'vue'
import { defineStore } from 'pinia'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const levels = ref<{ name: string; message: string }[]>([])

  function addLevel() {
    levels.value.push({ name: 'bla', message: 'foo' })
  }

  return { levels, addLevel }
})
