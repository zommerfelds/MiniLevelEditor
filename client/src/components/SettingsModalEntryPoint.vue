<script setup lang="ts">
import { useWorldStore } from '@/stores/world'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const worldStore = useWorldStore()
</script>

<template>
  <button
    type="button"
    class="btn btn-light"
    data-bs-toggle="modal"
    data-bs-target="#settingsModal"
    :disabled="worldStore.data.config == undefined"
  >
    <FontAwesomeIcon :icon="faGear" />
  </button>
</template>
