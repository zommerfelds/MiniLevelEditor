import { ref } from 'vue'
import { defineStore } from 'pinia'
import { makeDefaultLevel } from '../../../common/defaultData'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<any>({})
  const isDefaultData = ref(false)

  function addLevel() {
    data.value.levels.push(makeDefaultLevel())
  }

  return { data, addLevel, isDefaultData }
})
