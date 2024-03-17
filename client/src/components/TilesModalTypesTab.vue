<script setup lang="ts">
import { useWorldStore } from '@/stores/world'

const world = useWorldStore()
</script>

<template v-if="world.data.config">TODO: {{ world.data.config.tileTypes }}</template>

<style scoped></style>
