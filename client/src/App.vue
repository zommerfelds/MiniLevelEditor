<script setup lang="ts">
import LevelContent from '@/components/LevelContent.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import TileSelector from '@/components/TileSelector.vue'
import SettingsModalEntryPoint from '@/components/SettingsModalEntryPoint.vue'
import { useWorldStore, serverlessMode } from '@/stores/world'
import { useToolsStore } from '@/stores/tools'
import { computed } from 'vue'

const store = useWorldStore()
const levels = computed(() => store.data.levels)
const tools = useToolsStore()

store.loadWorldData()

function addLevel() {
  store.addLevel()
  tools.selectedLevel = store.data.levels.length - 1
}

function deleteLevel(index: number) {
  store.data.levels.splice(index, 1)

  if (tools.selectedLevel > index) {
    tools.selectedLevel--
  }
  if (tools.selectedLevel >= store.data.levels.length) {
    tools.selectedLevel = store.data.levels.length - 1
  }
}

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
      <div class="container">
        <div class="row align-items-center">
          <img class="col-10 pixelart ps-0" src="@/assets/logo.png" />
          <SettingsModalEntryPoint />
        </div>
      </div>
      <hr />
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
            <button
              class="bi bi-trash3-fill ms-2 lvl-delete float-end"
              @click.stop="deleteLevel(index)"
            ></button>
          </div>
        </li>
        <li>
          <a href="#" class="nav-link text-white" @click="addLevel()">
            <i class="bi bi-plus-square me-2"></i> Add level
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
      <LevelContent />
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
