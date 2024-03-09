import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { makeDefaultLevel, makeDefaultData } from '../../../common/defaultData'
import { useRefHistory } from '@vueuse/core'

export const serverlessMode = __APP_MODE == 'SERVERLESS'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<any>({})
  const isDefaultData = ref(false)
  const loadingError = ref(false)
  const dataHistory = useRefHistory(data, { deep: true })
  const dataRevision = ref(0)

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
        throw 'Could not fetch data from server'
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
    // Clear the history after the initial data is saved. Needs to be in timeout otherwise the history won't have been created yet.
    setTimeout(dataHistory.clear, 0)
  }

  // Load data asynchronously.
  loadWorldData().catch((err: any) => {
    loadingError.value = true
    console.error('Loading error:', err)
  })

  function undo() {
    dataHistory.undo()
    dataRevision.value++
  }

  function redo() {
    dataHistory.redo()
    dataRevision.value++
  }

  return {
    data,
    isDefaultData,
    loadingError,
    canUndo: dataHistory.canUndo,
    canRedo: dataHistory.canRedo,
    dataRevision, // Is incremented when the data is updated outside the the content editor.
    undo,
    redo,
    addLevel,
    loadWorldData,
  }
})
