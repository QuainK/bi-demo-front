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
import { ref, watch } from 'vue'

const props = defineProps<{
  table: any
}>()

const data = ref<any[]>([])
// 测试数据
// const data = ref<any[]>([
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
//   { a: 1, b: 2, c: 3, '中文表头': '哈哈哈' },
// ])

const columnPropList = ref<string[]>([])

watch(
  () => props.table,
  (val) => {
    if (Array.isArray(val) && val.length) {
      data.value = val
      columnPropList.value = [...Object.keys(val[0])]
    }
  }
)
</script>

<style scoped lang="scss">
</style>
