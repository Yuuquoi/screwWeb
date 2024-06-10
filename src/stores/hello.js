import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 變數
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  // 方法
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

// vue 中的寫法
// import { useCounterStore } from '../stores/hello'
// const countStore = useCounterStore();
// 接著用.去呼叫裡面的東西