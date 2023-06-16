<template>
  <div class="container">
    <DataImport @change="handleDataChange" />
    <DataShow :table="tableData" />
  </div>
</template>

<script setup lang="ts">
import DataImport from '@/views/data-import.vue'
import DataShow from '@/views/data-show.vue'
import { ref } from 'vue'

const tableData = ref()

const handleDataChange = (val: any) => {
  tableData.value = val
}
</script>

<style scoped lang="scss">
.container {
  padding: 50px;
}
</style>
