<script setup lang="ts">
// import { Modal } from 'bootstrap'
import { ref, onMounted } from 'vue'
import { useWorldStore } from '@/stores/world'

const worldStore = useWorldStore()

let gridCellWidth = ref(0)
let gridCellHeight = ref(0)
let tileset = ref('')

let tilesetFiles = ref([])

function onSaveSettings() {
  worldStore.data.config.gridCellWidth = gridCellWidth.value
  worldStore.data.config.gridCellHeight = gridCellHeight.value
  worldStore.data.config.tileset = tileset.value
}

onMounted(() => {
  // Use this to auto-show the dialog (for development):
  // setTimeout(() => Modal.getOrCreateInstance('#exampleModal').show(), 500)

  const dialog = document.getElementById('exampleModal')!!

  dialog.addEventListener('show.bs.modal', () => {
    gridCellWidth.value = worldStore.data.config.gridCellWidth
    gridCellHeight.value = worldStore.data.config.gridCellHeight
    tileset.value = worldStore.data.config.tileset

    const getUrl = '/api/tileset-list'
    fetch(getUrl).then(async (response) => {
      const json = await response.json()
      tilesetFiles.value = json.files
    })
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
          <div class="d-flex pb-3">
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
          <div class="d-flex pb-3">
            <div class="flex-grow-1">
              <label class="col-form-label">Tileset</label>
            </div>
            <div class="dropdown">
              <button
                class="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ tileset }}
              </button>
              <ul class="dropdown-menu">
                <li v-for="(file, index) in tilesetFiles" :key="index">
                  <a class="dropdown-item" href="#" @click="tileset = file">{{ file }}</a>
                </li>
              </ul>
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
