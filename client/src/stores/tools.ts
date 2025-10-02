import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum Tool {
  Pan,
  Draw,
  Erase,
  Move,
  Select,
  Bucket,
}

// Local storage for all level data.
export const useToolsStore = defineStore('tools', () => {
  const selectedTool = ref(Tool.Draw)
  const selectedTile = ref(0)
  const lastSelectedTilePerLayer = ref<number[]>([1])
  const selectedLayer = ref(0)
  const selectedLevel = ref(0)
  const warningMessage = ref<string | undefined>(undefined)
  const toolOptionMoveSwap = ref(false)
  const selectionToolRect = ref<
    { left: number; top: number; right: number; bottom: number } | undefined
  >(undefined)

  return {
    selectedTool,
    selectedTile,
    lastSelectedTilePerLayer,
    selectedLayer,
    selectedLevel,
    warningMessage,
    toolOptionMoveSwap,
    selectionToolRect,
  }
})
