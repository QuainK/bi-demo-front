<template>
  <el-button
    type="primary"
    @click="onClickUpload"
  >
    上传
  </el-button>

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

  <ImportDialog
    :visible="dialogImportVisible"
    @change="handleDataChange"
    @close="closeDialogImport"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ImportDialog from './dialogImport.vue'

const onClickUpload = () => {
  dialogImportVisible.value = true
}

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

const dialogImportVisible = ref(false)

const closeDialogImport = () => {
  dialogImportVisible.value = false
}

const handleDataChange = (val: any) => {
  data.value = val
  columnPropList.value = [...Object.keys(val[0])]
}

watch(
  dialogImportVisible,
  (val) => {
    console.log('dialogImportVisible', val)
  }
)
</script>

<style scoped lang="scss">
</style>
