<script setup lang="ts">
// import { Modal } from 'bootstrap'
import { ref, onMounted } from 'vue'
import { useWorldStore } from '@/stores/world'
import MyDropdown from '@/components/MyDropdown.vue'

const worldStore = useWorldStore()

let gridCellWidth = ref(0)
let gridCellHeight = ref(0)
let tilesetImage = ref('')
let tilesetTileWidth = ref(0)
let tilesetTileHeight = ref(0)

let tilesetFiles = ref<string[]>([])

function onSaveSettings() {
  worldStore.getWorldData().config.gridCellWidth = gridCellWidth.value
  worldStore.getWorldData().config.gridCellHeight = gridCellHeight.value
  worldStore.getWorldData().config.tilesetImage = tilesetImage.value
  worldStore.getWorldData().config.tilesetTileWidth = tilesetTileWidth.value
  worldStore.getWorldData().config.tilesetTileHeight = tilesetTileHeight.value
}

onMounted(() => {
  // Use this to auto-show the dialog (for development):
  // setTimeout(() => Modal.getOrCreateInstance('#settingsModal').show(), 500)

  const dialog = document.getElementById('settingsModal')!!

  dialog.addEventListener('show.bs.modal', async () => {
    gridCellWidth.value = worldStore.getWorldData().config.gridCellWidth
    gridCellHeight.value = worldStore.getWorldData().config.gridCellHeight
    tilesetImage.value = worldStore.getWorldData().config.tilesetImage
    tilesetTileWidth.value = worldStore.getWorldData().config.tilesetTileWidth
    tilesetTileHeight.value = worldStore.getWorldData().config.tilesetTileHeight

    // TODO: show a nicer text instead of the raw __builtin ID
    tilesetFiles.value = await worldStore.getAvailableTilesets()
  })
})
</script>

<template>
  <div
    class="modal fade text-black"
    id="settingsModal"
    tabindex="-1"
    aria-labelledby="settingsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="settingsModalLabel">Project settings</h1>
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

            <MyDropdown :list="tilesetFiles" v-model="tilesetImage" />
          </div>
          <div class="d-flex pb-3">
            <div class="flex-grow-1">
              <label class="col-form-label">Tileset tile size</label>
            </div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="tilesetTileWidth" />
            </div>
            <div class="p-1">x</div>
            <div class="size-input">
              <input type="number" class="form-control" v-model="tilesetTileHeight" />
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
