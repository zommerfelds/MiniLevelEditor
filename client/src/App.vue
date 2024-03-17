<script setup lang="ts">
import LevelContent from '@/components/LevelContent.vue'
import TopToolbar from '@/components/TopToolbar.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import TileSelector from '@/components/TileSelector.vue'
import LevelSelector from '@/components/LevelSelector.vue'
import SettingsModalEntryPoint from '@/components/SettingsModalEntryPoint.vue'
import { useWorldStore, serverlessMode } from '@/stores/world'
import { LevelChecker } from '@/logic/LevelChecker'

const world = useWorldStore()

async function loadLevelFromDir() {
  const dirHandle = await window.showDirectoryPicker()
  const fileHandle = await dirHandle.getFileHandle('levels.json', {})
  const file = await fileHandle.getFile()
  const text = await file.text()
  world.data = JSON.parse(text)
  world.isDefaultData = false
}

new LevelChecker().watch()
</script>

<template>
  <div class="h-100 d-flex align-items-stretch">
    <div
      class="border-end border-secondary d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style="width: 280px"
    >
      <div class="d-flex align-items-center global-toolbar-height">
        <div class="flex-grow-1 pe-2">
          <img
            class="pixelart"
            src="@/assets/logo.png"
            style="width: 100%; vertical-align: bottom"
          />
        </div>
        <SettingsModalEntryPoint />
      </div>
      <!-- Note: margin should be the same as the padding of the parent, so the toolbar height matches -->
      <hr class="mt-3" />
      <div v-if="serverlessMode">
        <div class="p-2 text-warning" style="font-weight: bold">
          <p>[WIP: Serverless mode]</p>
          <button class="btn btn-secondary" @click="loadLevelFromDir()">Load directory</button>
        </div>
        <hr />
      </div>
      <LevelSelector />
      <hr />
      <TileSelector />
    </div>

    <!-- min-width fix: https://stackoverflow.com/a/66689926/3810493 -->
    <div class="flex-grow-1" style="min-width: 0">
      <div class="d-flex h-100 align-items-center justify-content-center" v-if="world.loadingError">
        <h1 class="text-danger">Error connecting to server</h1>
      </div>

      <div class="d-flex flex-column h-100">
        <TopToolbar />
        <LevelContent />
      </div>
    </div>
  </div>

  <SettingsModal />
</template>
