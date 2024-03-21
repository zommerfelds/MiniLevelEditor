<script setup lang="ts">
import { useToolsStore } from '@/stores/tools'
import { useWorldStore } from '@/stores/world'
import { computed, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faSquarePlus, faBars } from '@fortawesome/free-solid-svg-icons'
import draggable from 'vuedraggable'

const tools = useToolsStore()
const world = useWorldStore()

const levels = computed(() => world.data.levels)

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
</script>

<template>
  <ul class="nav nav-pills flex-column mb-auto">
    <!--li v-for="(level, index) in levels" :key="index" class="nav-item"-->
    <draggable :list="levels" handle=".handle" item-key="id">
      <template #item="{ level, index }">
        <li class="nav-item">
          <div
            class="nav-link lvl-selector-row"
            :class="index == tools.selectedLevel ? 'active' : ''"
            aria-current="page"
            @click="tools.selectedLevel = index"
          >
            <FontAwesomeIcon :icon="faBars" class="me-3 draghandle" />
            <a href="#" class="lvl-selector-link text-white"> {{ level.id }} ({{ index + 1 }}) </a>
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
</style>
