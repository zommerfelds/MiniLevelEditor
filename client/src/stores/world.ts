import { ref } from 'vue'
import { defineStore } from 'pinia'
import defaultLevel from '../../../common/level-default.json'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<any>({})

  function addLevel() {
    data.value.levels.push(JSON.parse(JSON.stringify(defaultLevel)))
  }

  return { data, addLevel }
})
