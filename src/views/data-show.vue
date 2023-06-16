<template>
  <el-table
    :data="data"
    stripe
    border
  >
    <el-table-column
      v-for="(columnProp,index) in columnPropList "
      :key="index"
      :prop="columnProp"
      :label="columnProp"
    />
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
  { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
])

const columnPropList = ref<string[]>([])

if (data.value.length) {
  columnPropList.value = [...Object.keys(data.value[0])]
}
</script>

<style scoped lang="scss">
</style>
