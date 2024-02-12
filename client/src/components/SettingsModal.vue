<script setup lang="ts">
// import { Modal } from 'bootstrap'
import { ref, onMounted } from 'vue'
import { useWorldStore } from '@/stores/world'

const worldStore = useWorldStore()

let gridCellWidth = ref(16)
let gridCellHeight = ref(16)

function onSaveSettings() {
  worldStore.data.config.gridCellWidth = gridCellWidth.value
  worldStore.data.config.gridCellHeight = gridCellHeight.value
}

onMounted(() => {
  // Use this to auto-show the dialog (for development):
  // Modal.getOrCreateInstance('#exampleModal').show()

  const dialog = document.getElementById('exampleModal')!!

  dialog.addEventListener('show.bs.modal', () => {
    gridCellWidth.value = worldStore.data.config.gridCellWidth
    gridCellHeight.value = worldStore.data.config.gridCellHeight
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
    <div class="modal-dialog modal-dialog-centered">
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
              <label class="col-form-label">Grid cell size</label>
            </div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="gridCellWidth" />
            </div>
            <div class="p-1">x</div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="gridCellHeight" />
            </div>
            <div class="p-1">px</div>
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
