import { computed, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { makeDefaultLevel, makeDefaultData } from '@common/defaultData'
import { useRefHistory } from '@vueuse/core'
import type { LoadingWorldData, WorldData } from '@common/dataTypes'
import { get, set } from 'idb-keyval'

// Note: the below imports are only needed for serverless mode. Maybe we can avoid loading them for normal mode.
import { format } from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'

export const serverlessMode = __APP_MODE === 'SERVERLESS'

const levelsFileIdbKey = 'levelsFileHandleKey'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<WorldData | LoadingWorldData>({})
  const isDefaultData = ref(true)
  const loadingError = ref(false)
  const dataHistory = useRefHistory(data, { deep: true })
  const dataRevision = ref(0)

  const isLoaded = computed(() => (data.value as any)['config'] !== undefined)

  function addLevel() {
    ;(data.value as WorldData).levels.push(makeDefaultLevel())
  }

  async function loadWorldData() {
    if (serverlessMode) {
      const fileHandleOrUndefined = await get(levelsFileIdbKey)
      if (fileHandleOrUndefined !== undefined) {
        console.log('Found previously loaded file:', fileHandleOrUndefined)
        const perm = { mode: 'readwrite' }
        if ((await fileHandleOrUndefined.queryPermission(perm)) === 'granted') {
          await loadLevelFromFileSystem(fileHandleOrUndefined)
        } else {
          console.log('No permission to access previously accessed file')
          // NOTE: we could add a button to regrant the permission and call (needs a user click):
          // await fileHandleOrUndefined.requestPermission(perm)
        }
      }
    } else {
      // Simulate a loading delay:
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const getUrl = '/api/get'
      const response = await fetch(getUrl)
      if (!response.ok) {
        throw 'Could not fetch data from server'
      }
      const json = await response.json()
      // console.log('Loaded from server:', JSON.stringify(json))
      data.value = json
      isDefaultData.value = false

      const postUrl = '/api/post'

      watchEffect(async () => {
        const stateStr = JSON.stringify(data.value)
        // console.log('Sending to server:', stateStr)

        await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: stateStr,
        })
      })
    }

        if (!isLoaded.value) {
            data.value = makeDefaultData()
    }

    // Clear the history after the initial data is saved. Needs to be in timeout otherwise the history won't have been created yet.
    setTimeout(dataHistory.clear, 0)
  }

  async function loadLevelFromFileSystem(fileHandle: FileSystemFileHandle) {
    const file = await fileHandle.getFile()
    const text = await file.text()
    data.value = JSON.parse(text)
    isDefaultData.value = false

    watchEffect(async () => {
      const stateStr = JSON.stringify(data.value)
      const stateStrPretty = await format(stateStr, {
        parser: 'json',
        plugins: [prettierPluginBabel, prettierPluginEstree],
      })

      const writable = await fileHandle.createWritable()
      writable.write(stateStrPretty)
      writable.close()
    })
  }

  async function showDirPickerAndLoadLevel() {
    const dirHandle = await window.showDirectoryPicker()
    // TODO: handle 'levels.json' file not present
    const fileHandle = await dirHandle.getFileHandle('levels.json', {})
    await set(levelsFileIdbKey, fileHandle)
    loadLevelFromFileSystem(fileHandle)
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

  function updateRevision() {
    dataRevision.value++
  }

  function getWorldData(): WorldData {
    if (!isLoaded.value) throw 'Invalid state: world data accessed before isLoaded is true'
    return data.value as WorldData
  }

  return {
    isLoaded,
    data,
    getWorldData,
    isDefaultData,
    loadingError,
    canUndo: dataHistory.canUndo,
    canRedo: dataHistory.canRedo,
    dataRevision, // Is incremented when the data is updated outside the the content editor.
    updateRevision,
    undo,
    redo,
    addLevel,
    showDirPickerAndLoadLevel,
  }
})
