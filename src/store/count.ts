import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increase() {
      this.count++
    },
  },
  persist: {
    storage: localStorage,
  }
})
