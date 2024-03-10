<script setup lang="ts">
</script>

<template>
  <div
    class="modal fade text-black"
    id="tilesModal"
    tabindex="-1"
    aria-labelledby="tilesModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="tilesModalLabel">Tiles</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>TODO</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="onSaveSettings"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
