import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWorldStore = defineStore('world', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  const message = ref("bla")

  const levels = ref<[{ name: string, message: string }]>([{ name: "level 1", message: "level 1 content" }]);

  function addLevel() {
    levels.value.push({ name: "bla", message: "foo" });
  }

  return { count, doubleCount, increment, message, levels, addLevel }
})
