import { ref, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { makeDefaultLevel, makeDefaultData } from '../../../common/defaultData'

export const serverlessMode = __APP_MODE == 'SERVERLESS'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<any>({})
  const isDefaultData = ref(false)
  const loadingError = ref(false)

  function addLevel() {
    data.value.levels.push(makeDefaultLevel())
  }

  async function loadWorldData() {
    if (serverlessMode) {
      data.value = makeDefaultData()
      isDefaultData.value = true
    } else {
      // Simulate a loading delay:
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const getUrl = '/api/get'
      const response = await fetch(getUrl)
      if (!response.ok) {
        loadingError.value = true
        return
      }
      const json = await response.json()
      console.log('Loaded from server:', JSON.stringify(json))
      data.value = json

      const postUrl = '/api/post'

      watchEffect(async () => {
        const stateStr = JSON.stringify(data.value)
        console.log('Sending to server:', stateStr)

        await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: stateStr,
        })
      })
    }
  }

  return { data, isDefaultData, loadingError, addLevel, loadWorldData }
})
