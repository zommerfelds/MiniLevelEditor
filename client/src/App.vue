<script setup lang="ts">
import LevelContent from './components/LevelContent.vue'
import { useWorldStore } from '@/stores/world'
import { ref, computed } from 'vue'

const store = useWorldStore()
const levels = computed(() => store.levels)
const currentLevel = ref(0)

const getUrl = '/api/get'
fetch(getUrl).then(async response => {
  const json = await response.json()
  console.log('Loaded from server:', JSON.stringify(json))
  store.levels = json.levels
})

const postUrl = '/api/post'

store.$subscribe(async (mutation, state) => {
  const stateStr = JSON.stringify(state)
  console.log('Sending to server:', stateStr)

  const response = await fetch(postUrl, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: stateStr
  })
  const json = await response.text()
  console.log(json)
})
</script>

<template>
  <div class="h-100 d-flex align-items-stretch">
    <div class="border-end d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px">
      <a href="/" class="align-items-center">
        <img class="pixelart" src="@/assets/logo.png" width="240" />
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li v-for="(level, index) in levels" :key="index" class="nav-item">
          <a href="#" class="nav-link" :class="index == currentLevel ? 'active' : ''" aria-current="page"
            @click="currentLevel = index">
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg>
            Level {{ index + 1 }}
          </a>
        </li>
        <li>
          <a href="#" class="nav-link text-white" @click="store.addLevel()">
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg>
            + add level
          </a>
        </li>
      </ul>
    </div>

    <div class="flex-grow-1">
      <LevelContent :level="currentLevel" />
    </div>
  </div>
</template>

<style scoped></style>
