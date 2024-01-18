<script setup lang="ts">
import LevelContent from './components/LevelContent.vue'
import { useWorldStore } from '@/stores/world'
import { ref } from 'vue'

const store = useWorldStore()
const levels = store.levels
const currentLevel = ref(0)

store.$subscribe((mutation, state) => {
  // TODO: send to server
  console.log(JSON.stringify(state))
})
</script>

<template>
  <div class="h-100 d-flex align-items-stretch">
    <div
      class="border-end d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style="width: 280px"
    >
      <a
        href="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <img class="pixelart" src="@/assets/logo.png" width="100" />
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li v-for="(level, index) in levels" :key="index" class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="index == currentLevel ? 'active' : ''"
            aria-current="page"
            @click="currentLevel = index"
          >
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg>
            {{ level.name }}
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
