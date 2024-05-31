<script setup lang="ts">
import { useToolsStore, Tool } from '@/stores/tools'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons'

const tools = useToolsStore()

const props = defineProps<{
  tool: Tool
  icon: IconDefinition
  tooltipText: string
}>()
</script>

<template>
  <button
    type="button"
    class="btn white-tooltip"
    :class="tools.selectedTool == props.tool ? 'btn-success' : 'btn-light'"
    data-toggle="button"
    @click="tools.selectedTool = props.tool"
    data-bs-toggle="tooltip"
    data-bs-placement="bottom"
    :title="tooltipText"
  >
    <FontAwesomeIcon :icon="props.icon" />
  </button>
</template>
