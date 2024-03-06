import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum Tool {
  Move,
  Draw,
  Erase,
}

// Local storage for all level data.
export const useToolsStore = defineStore('tools', () => {
  const selectedTool = ref(Tool.Draw)
  const selectedTile = ref(1)
  const lastSelectedTilePerLayer = ref<number[]>([1])
  const selectedLayer = ref(0)
  const selectedLevel = ref(0)

  return { selectedTool, selectedTile, lastSelectedTilePerLayer, selectedLayer, selectedLevel }
})
