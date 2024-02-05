import { ref } from 'vue'
import { defineStore } from 'pinia'
import defaultLevel from '../../../common/level-default.json'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const levels = ref<any[]>([])

  function addLevel() {
    levels.value.push(JSON.parse(JSON.stringify(defaultLevel)))
  }

  return { levels, addLevel }
})
