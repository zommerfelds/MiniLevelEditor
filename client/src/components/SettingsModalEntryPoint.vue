<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
const worldStore = useWorldStore()
</script>

<template>
  <button
    type="button"
    class="col-2 btn btn-light"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    :disabled="worldStore.data.config == undefined"
  >
    <i class="bi bi-gear"></i>
  </button>
</template>
