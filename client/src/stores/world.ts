import { ref } from 'vue'
import { defineStore } from 'pinia'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const levels = ref<any[]>([])

  function addLevel() {
    levels.value.push({ todo: 'update the format here' })
  }

  return { levels, addLevel }
})
