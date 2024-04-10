import { computed, ref, watch, watchEffect } from 'vue'
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

const levelsDirIdbKey = 'levelsDirHandleKey'
const builtInTilesetName = '__builtin'

// Local storage for all level data.
export const useWorldStore = defineStore('world', () => {
  const data = ref<WorldData | LoadingWorldData>({})
  const isDefaultData = ref(true) // TODO: is this really needed?
  const syncingToDisk = ref(false) // Whether or not the level is being auto-synced to the filesystem API
  const loadingError = ref(false)
  const dataHistory = useRefHistory(data, { deep: true })
  const dataRevision = ref(0)
  const dirHandle = ref<FileSystemDirectoryHandle>()

  const isLoaded = computed(() => (data.value as any)['config'] !== undefined)

  function addLevel() {
    getWorldData().levels.push(makeDefaultLevel())
  }

  async function loadWorldData() {
    if (serverlessMode) {
      const dirHandleOrUndefined = await get(levelsDirIdbKey)
      if (dirHandleOrUndefined !== undefined) {
        console.log('Found previously loaded directory:', dirHandleOrUndefined)
        dirHandle.value = dirHandleOrUndefined
        try {
          const fileHandle = await dirHandleOrUndefined.getFileHandle('levels.json', {})
          const perm = { mode: 'readwrite' }
          if ((await fileHandle.queryPermission(perm)) === 'granted') {
            await loadLevelFromFileSystem(fileHandle)
            await watchLevelChangesAndSaveToDisk(fileHandle)
          } else {
            console.log('No permission to access previously accessed file')
            // NOTE: we could add a button to regrant the permission and call (needs a user click):
            // await fileHandle.requestPermission(perm)
          }
        } catch (err) {
          console.warn('Could not load previously loaded file:', err)
        }
      }
    } else {
      // Simulate a loading delay:
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const getUrl = 'api/get'
      const response = await fetch(getUrl)
      if (!response.ok) {
        throw 'Could not fetch data from server'
      }
      const json = await response.json()
      // console.log('Loaded from server:', JSON.stringify(json))
      data.value = json
      isDefaultData.value = false

      const postUrl = 'api/post'

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
  }

  async function watchLevelChangesAndSaveToDisk(fileHandle: FileSystemFileHandle) {
    watchEffect(async () => {
      const stateStr = JSON.stringify(data.value)
      const stateStrPretty = await format(stateStr, {
        parser: 'json',
        plugins: [prettierPluginBabel, prettierPluginEstree],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(stateStrPretty)
      await writable.close()
      syncingToDisk.value = true
    })
  }

  async function showDirPickerAndSyncLevel(loadFirst: boolean) {
    dirHandle.value = await window.showDirectoryPicker()
    await set(levelsDirIdbKey, dirHandle.value)
    // TODO: warn user if a file will be overwritten
    const fileHandle = await dirHandle.value.getFileHandle('levels.json', { create: true })
    if (loadFirst) {
      await loadLevelFromFileSystem(fileHandle)
    }
    await watchLevelChangesAndSaveToDisk(fileHandle)
  }

  const tilesetFromDisk = ref<string>('')
  const tilesetUrl = computed(() => {
    if (!isLoaded.value) return ''

    if (getWorldData().config.tilesetImage === builtInTilesetName) {
      return 'built-in-tileset.png'
    }

    if (serverlessMode) {
      return '' + tilesetFromDisk.value
    }

    return 'api/tilesets/' + getWorldData().config.tilesetImage
  })

  async function loadTilesetUrlFromDisk() {
    console.log('Loading tileset from disk')
    const configTileset = getWorldData().config.tilesetImage
    // todo
    const tilesetDirHandle = await dirHandle.value!.getDirectoryHandle('test') // TODO: make configurable
    const tilesetFileHandle = await tilesetDirHandle.getFileHandle(configTileset)
    const tilesetBlob = await tilesetFileHandle.getFile()
    return URL.createObjectURL(tilesetBlob)
  }

  watch(
    () => (isLoaded.value ? getWorldData().config.tilesetImage : undefined),
    async (tilesetImage) => {
      if (serverlessMode) {
        if (tilesetImage !== builtInTilesetName) {
          tilesetFromDisk.value = await loadTilesetUrlFromDisk()
        }
      }
    }
  )

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
    // TODO: make this return WorldData | undefined to simplify access (!. instead of isLoaded ? ...)
    if (!isLoaded.value) throw 'Invalid state: world data accessed before isLoaded is true'
    return data.value as WorldData
  }

  async function getAvailableTilesets() {
    if (serverlessMode) {
      if (dirHandle.value === undefined) return [builtInTilesetName]
      const tilesetDirHandle = await dirHandle.value.getDirectoryHandle('test')
      const result = [builtInTilesetName]
      for await (const entry of tilesetDirHandle.values()) {
        if (entry.kind !== 'file') continue
        result.push(entry.name)
      }
      return result
    }
    const getUrl = 'api/tileset-list'
    const response = await fetch(getUrl)
    const json = await response.json()
    return [builtInTilesetName].concat(json.files)
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
    syncingToDisk,
    getAvailableTilesets,
    tilesetUrl,
    // tilesetFromDisk, // todo: needed?
    updateRevision,
    undo,
    redo,
    addLevel,
    showDirPickerAndSyncLevel,
  }
})
