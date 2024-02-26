<script setup lang="ts">
import LevelContent from '@/components/LevelContent.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import SettingsModalEntryPoint from '@/components/SettingsModalEntryPoint.vue'
import { useWorldStore } from '@/stores/world'
import { useToolsStore } from '@/stores/tools'
import { computed } from 'vue'
import { makeDefaultData } from '../../common/defaultData'

const store = useWorldStore()
const levels = computed(() => store.data.levels)
const tools = useToolsStore()

const serverlessMode = location.pathname.endsWith('/serverless')

if (serverlessMode) {
  store.data = makeDefaultData()
} else {
  const getUrl = '/api/get'
  fetch(getUrl).then(async (response) => {
    const json = await response.json()
    console.log('Loaded from server:', JSON.stringify(json))
    // Simulate a loading delay:
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    store.data = json
  })
}

const postUrl = '/api/post'

store.$subscribe(async (mutation, state) => {
  const stateStr = JSON.stringify(state.data)
  console.log('Sending to server:', stateStr)

  await fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: stateStr,
  })
})

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
      <div v-if="serverlessMode" class="p-2 text-warning" style="font-weight: bold;">[WIP: Serverless mode]</div>
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
    </div>

    <!-- min-width fix: https://stackoverflow.com/a/66689926/3810493 -->
    <div class="flex-grow-1" style="min-width: 0">
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
