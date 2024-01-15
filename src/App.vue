<script setup lang="ts">
import LevelContent from './components/LevelContent.vue'
</script>

<template>
  <div class="h-100 d-flex align-items-stretch">
    <div class="border-end d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <img class="pixelart" src="@/assets/logo.png" width="100" />
      </a>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <a href="#" class="nav-link active" aria-current="page">
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#home"></use>
            </svg>
            Level 1
          </a>
        </li>
        <li>
          <a href="#" class="nav-link text-white">
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#speedometer2"></use>
            </svg>
            Level 2
          </a>
        </li>
        <li>
          <a href="#" class="nav-link text-white">
            <svg class="bi me-2" width="16" height="16">
              <use xlink:href="#table"></use>
            </svg>
            Level 3
          </a>
        </li>
      </ul>
    </div>

    <div class="flex-grow-1">
      <LevelContent />
    </div>
  </div>
</template>

<style scoped></style>
