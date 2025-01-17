<script setup lang="ts">
import { ref } from 'vue'
import TilesModalTilesTab from '@/components/TilesModalTilesTab.vue'
import TilesModalTypesTab from '@/components/TilesModalTypesTab.vue'

let currentTab = ref('Tiles')
</script>

<template>
  <div
    class="modal fade text-black"
    id="tilesModal"
    tabindex="-1"
    aria-labelledby="tilesModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <ul class="nav nav-pills nav-fill">
            <li class="nav-item me-1" v-for="(tab, index) in ['Tiles', 'Types']" v-bind:key="index">
              <a
                class="nav-link"
                :class="currentTab === tab ? 'active' : ''"
                aria-current="page"
                href="#"
                @click="currentTab = tab"
              >
                {{ tab }}
              </a>
            </li>
          </ul>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div id="tilesModalBody" class="modal-body pb-4 my-modal-body">
          <TilesModalTilesTab v-if="currentTab === 'Tiles'" />
          <TilesModalTypesTab v-if="currentTab === 'Types'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-modal-body {
  height: 80vh;
  overflow-y: auto;
}
</style>
