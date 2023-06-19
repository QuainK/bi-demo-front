import { defineStore } from 'pinia'

export const useDataSourceStore = defineStore('dataSourceStore', {
  state: () => ({
    originalList: [],
    modifiedList: [],
  }),
  getters: {},
  actions: {},
  persist: {
    storage: localStorage,
  }
})
