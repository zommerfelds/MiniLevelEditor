<script setup lang="ts">
import { faSquarePlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const selectedLabels = defineModel({
  required: true,
  type: Array<string>,
})

const props = defineProps<{
  labels: string[]
}>()
</script>

<template>
  <template v-for="(selectedLabel, selectedLabelIndex) in selectedLabels" :key="selectedLabelIndex">
    <span
      class="badge rounded-pill ps-3 me-1 bg-secondary d-inline-flex align-items-center justify-content-center"
    >
      <div class="dropdown">
        <button
          class="btn btn-sm btn-secondary p-0"
          @click="console.log('not implemented')"
          :id="'dropdown_' + $.uid + '_' + selectedLabelIndex"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ selectedLabel }}
        </button>
        <ul class="dropdown-menu" :aria-labelledby="'dropdown_' + $.uid + '_' + selectedLabelIndex">
          <template v-for="(label, labelIndex) in props.labels" :key="labelIndex">
            <li v-if="label != selectedLabel">
              <a
                class="dropdown-item"
                href="#"
                @click="selectedLabels[selectedLabelIndex] = label"
                >{{ label }}</a
              >
            </li>
          </template>
        </ul>
      </div>
      <button
        href="#"
        class="btn btn-sm p-0 text-white ms-2"
        @click="selectedLabels.splice(selectedLabelIndex, 1)"
      >
        <FontAwesomeIcon :icon="faTimesCircle" />
      </button>
    </span>
  </template>
  <span class="p-1"></span>
  <span class="dropdown align-text-top">
    <button
      class="btn text-secondary p-0"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :id="'dropdown_' + $.uid + '_add'"
    >
      <FontAwesomeIcon :icon="faSquarePlus" />
    </button>
    <ul class="dropdown-menu" :aria-labelledby="'dropdown_' + $.uid + '_add'">
      <template v-for="(label, labelIndex) in props.labels" :key="labelIndex">
        <li v-if="!selectedLabels?.includes(label)">
          <a class="dropdown-item" href="#" @click="selectedLabels.push(label)">{{ label }}</a>
        </li>
      </template>
    </ul>
  </span>
</template>

<style scoped>
.dropdown-fill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
}
</style>
