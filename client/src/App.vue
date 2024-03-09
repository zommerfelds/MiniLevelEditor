<script setup lang="ts">
import LevelContent from '@/components/LevelContent.vue'
import Toolbar from './components/Toolbar.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import TileSelector from '@/components/TileSelector.vue'
import SettingsModalEntryPoint from '@/components/SettingsModalEntryPoint.vue'
import { useWorldStore, serverlessMode } from '@/stores/world'
import { useToolsStore } from '@/stores/tools'
import { computed, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

const store = useWorldStore()
const levels = computed(() => store.data.levels)
const tools = useToolsStore()

function addLevel() {
  store.addLevel()
  tools.selectedLevel = store.data.levels.length - 1
}

function deleteLevel(index: number) {
  store.data.levels.splice(index, 1)

  if (tools.selectedLevel > index) {
    tools.selectedLevel--
  }
}

// If the current index is past the end, fix it. This could for example happen on undo, or deleting the last level.
watch(
  () => computed(() => store.data.levels?.length),
  () => {
    if (tools.selectedLevel >= store.data.levels.length) {
      tools.selectedLevel = store.data.levels.length - 1
    }
  },
  { deep: true }
)

async function loadLevelFromDir() {
  const dirHandle = await window.showDirectoryPicker()
  const fileHandle = await dirHandle.getFileHandle('levels.json', {})
  const file = await fileHandle.getFile()
  const text = await file.text()
  store.data = JSON.parse(text)
  store.isDefaultData = false
}
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
      <ul class="nav nav-pills flex-column mb-auto">
        <li v-for="(level, index) in levels" :key="index" class="nav-item">
          <div
            class="nav-link lvl-selector-row"
            :class="index == tools.selectedLevel ? 'active' : ''"
            aria-current="page"
            @click="tools.selectedLevel = index"
          >
            <a href="#" class="lvl-selector-link text-white"> Level {{ index + 1 }} </a>
            <FontAwesomeIcon
              :icon="faTrash"
              class="mt-1 lvl-delete float-end"
              @click.stop="deleteLevel(index)"
            />
            <!-- TODO: fix undo when removing a level, zoom seems to be stuck. Probably undo needs to take into account level num. -->
          </div>
        </li>
        <li>
          <a href="#" class="nav-link text-white" @click="addLevel()">
            <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add level
          </a>
        </li>
      </ul>
      <hr />
      <TileSelector />
    </div>

    <!-- min-width fix: https://stackoverflow.com/a/66689926/3810493 -->
    <div class="flex-grow-1" style="min-width: 0">
      <div class="d-flex h-100 align-items-center justify-content-center" v-if="store.loadingError">
        <h1 class="text-danger">Error connecting to server</h1>
      </div>

      <div class="d-flex flex-column h-100">
        <Toolbar />
        <LevelContent />
      </div>
    </div>
  </div>

  <SettingsModal />
</template>

<style scoped>
.lvl-selector-link {
  text-decoration: none;
}

.lvl-selector-row {
  cursor: pointer;
}

.lvl-delete {
  background: none repeat scroll 0 0 transparent;
  border: medium none;
  border-spacing: 0;
  color: #ffffff;
}
</style>
