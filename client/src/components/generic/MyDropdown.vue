<script setup lang="ts" generic="T">
const selectedItem = defineModel<T>({ default: undefined })

type DetailedListELement = { value: T; onclick?: () => void }
type ListElement = T | DetailedListELement

const props = defineProps<{
  list: ListElement[]
  default?: T // When no v-model is bound, a default value or placeholder for the dropdown can be specified.
  fillWidth?: boolean
  modelToNameFunc?: (model: T) => string // Can be defined in case String(model) is not sufficient.
}>()

function mapModelToName(model: T): string {
  if (props.modelToNameFunc !== undefined) {
    return props.modelToNameFunc(model)
  }
  // Fallback string representation
  return String(model)
}

function init() {
  if (selectedItem.value !== undefined) return

  if (props.default !== undefined) {
    selectedItem.value = props.default
  } else if (props.list.length > 0) {
    selectedItem.value = getDetailedItem(props.list[0]!!).value
  }
}

function getDetailedItem(el: ListElement): DetailedListELement {
  if ((el as any).value !== undefined) return el as DetailedListELement
  return {
    value: el as T,
  }
}

function getItemName(el: ListElement): string {
  return mapModelToName(getDetailedItem(el).value)
}

function select(el: ListElement) {
  const item = getDetailedItem(el)
  item.onclick?.()
  selectedItem.value = item.value
}

init()
</script>

<template>
  <div class="dropdown">
    <button
      class="btn btn-light dropdown-toggle"
      :class="props.fillWidth ? 'dropdown-fill' : ''"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ selectedItem === undefined ? 'undefined' : getItemName(selectedItem) }}
    </button>
    <ul class="dropdown-menu">
      <slot></slot>

      <li v-for="(el, index) in props.list" :key="index">
        <a class="dropdown-item" href="#" @click="select(el)">
          {{ getItemName(el) }}
        </a>
      </li>
    </ul>
  </div>
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
