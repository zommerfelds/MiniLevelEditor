<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { computed, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import draggable from 'vuedraggable'

const tools = useToolsStore()
const world = useWorldStore()

function addLevel() {
  world.addLevel()
  tools.selectedLevel = world.data.levels.length - 1
}

function deleteLevel(index: number) {
  world.data.levels.splice(index, 1)

  if (tools.selectedLevel > index) {
    tools.selectedLevel--
  }
}
// If the current index is past the end, fix it. This could for example happen on undo, or deleting the last level.
watch(
  () => computed(() => world.data.levels?.length),
  () => {
    if (tools.selectedLevel >= world.data.levels.length) {
      tools.selectedLevel = world.data.levels.length - 1
    }
  },
  { deep: true }
)

function onDragChange(ev: { moved?: { oldIndex: number; newIndex: number } }) {
  // https://github.com/SortableJS/Vue.Draggable.next?tab=readme-ov-file#events
  if (ev.moved === undefined) return

  if (ev.moved.oldIndex === tools.selectedLevel) {
    tools.selectedLevel = ev.moved.newIndex
  } else if (ev.moved.oldIndex > tools.selectedLevel && ev.moved.newIndex <= tools.selectedLevel) {
    tools.selectedLevel++
  } else if (ev.moved.oldIndex < tools.selectedLevel && ev.moved.newIndex >= tools.selectedLevel) {
    tools.selectedLevel--
  }
}
</script>

<template>
  <ul class="nav nav-pills flex-column mb-auto user-select-none">
    <draggable
      :list="world.data.levels"
      item-key="id"
      @change="onDragChange"
      ghost-class="drag-ghost"
      drag-class="drag-active"
    >
      <template #item="{ element, index }">
        <li class="nav-item">
          <div
            class="nav-link lvl-selector-row"
            :class="index == tools.selectedLevel ? 'active' : ''"
            aria-current="page"
            @click="tools.selectedLevel = index"
          >
            <a href="#" class="lvl-selector-link text-white">
              [{{ index + 1 }}] {{ element?.name }}
            </a>
            <FontAwesomeIcon
              :icon="faTrash"
              class="mt-1 lvl-delete float-end"
              @click.stop="deleteLevel(index)"
            />
            <!-- TODO: fix undo when removing a level, zoom seems to be stuck. Probably undo needs to take into account level num. -->
          </div>
        </li>
      </template>
    </draggable>
    <li>
      <a href="#" class="nav-link text-white" @click="addLevel()">
        <FontAwesomeIcon :icon="faSquarePlus" class="me-3" />Add level
      </a>
    </li>
  </ul>
</template>

<style scoped>
.lvl-selector-link {
  text-decoration: none;
}

.lvl-selector-row {
  cursor: pointer;
}

.lvl-delete {
  background: none repeat scroll 0 0 transparent;
  border: medium none;
  border-spacing: 0;
  color: #ffffff;
}

.drag-ghost {
  opacity: 0.5;
}
.drag-active {
  background-color: rgb(72, 72, 72);
  border-radius: 0.4em;
}
</style>
