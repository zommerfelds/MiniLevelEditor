<script setup lang="ts">
// import { Modal } from 'bootstrap'
import { ref, onMounted } from 'vue'
import { useWorldStore } from '@/stores/world'

const worldStore = useWorldStore()

let gridWidth = ref(16)
let gridHeight = ref(16)

function onSaveSettings() {
  worldStore.data.config.gridWidth = gridWidth.value
  worldStore.data.config.gridHeight = gridHeight.value
}

onMounted(() => {
  // Use this to auto-show the dialog (for development):
  // Modal.getOrCreateInstance('#exampleModal').show()

  const dialog = document.getElementById('exampleModal')!!

  dialog.addEventListener('show.bs.modal', () => {
    gridWidth.value = worldStore.data.config.gridWidth
    gridHeight.value = worldStore.data.config.gridHeight
  })
})
</script>

<template>
  <div
    class="modal fade text-black"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Project settings</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-flex">
            <div class="flex-grow-1">
              <label class="col-form-label">Grid size</label>
            </div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="gridWidth" />
            </div>
            <div class="p-1">x</div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="gridHeight" />
            </div>
          </div>
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
.size-input {
  width: 5em;
}
</style>
