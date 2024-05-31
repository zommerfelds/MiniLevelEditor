<script setup lang="ts">
import LevelContent from '@/components/LevelContent.vue'
import TopToolbar from '@/components/TopToolbar.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import TileSelector from '@/components/TileSelector.vue'
import LevelSelector from '@/components/LevelSelector.vue'
import SettingsModalEntryPoint from '@/components/SettingsModalEntryPoint.vue'
import { useWorldStore, serverlessMode } from '@/stores/world'
import { LevelChecker } from '@/logic/LevelChecker'
import { onMounted } from 'vue'
import { Tooltip } from 'bootstrap'

const world = useWorldStore()

new LevelChecker().watch()

// Alternatively, we could initialize Tooltip for each local element like here:
// https://stackoverflow.com/a/71658190/3810493
onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']",
    delay: { show: 500, hide: 100 },
    trigger: 'hover',
  })
})
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
      <template v-if="serverlessMode">
        <div class="p-0 text-warning" style="font-weight: bold">
          <div class="pb-1 ps-1">Serverless mode</div>
          <div class="pb-1 ps-1" v-if="world.syncingToDisk">[changes are auto-saved]</div>
          <div class="pt-1">
            <button class="btn btn-secondary" @click="world.showDirPickerAndSyncLevel(true)">
              Load
            </button>
            <button class="ms-1 btn btn-secondary" @click="world.showDirPickerAndSyncLevel(false)">
              Save <span v-if="world.syncingToDisk">as</span>
            </button>
          </div>
        </div>
        <hr />
      </template>
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
