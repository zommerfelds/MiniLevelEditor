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
  const selectedLevel = ref(0)

  return { selectedTool, selectedTile, selectedLevel }
})
