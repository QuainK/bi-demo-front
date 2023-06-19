<template>
  <div>
    <el-button type="primary" @click="onClickUpload">导入数据</el-button>
    <template v-if="data.length">
      <el-button @click="onClickDeleteRedundant">删除重复行</el-button>
    </template>
  </div>

  <el-table
    :data="data"
    stripe
    border
    style="margin-top: 10px"
  >
    <el-table-column
      v-for="(columnProp,index) in columnPropList "
      :key="index"
      :prop="columnProp"
      :label="columnProp"
    />
  </el-table>

  <DialogImport
    :visible="dialogImportVisible"
    @change="handleDataChange"
    @close="closeDialogImport"
  />

  <DialogDeleteRedundant
    :visible="dialogDeleteRedundantVisible"
    :columns="columnPropList"
    @filter="filterRedundant"
    @close="closeDialogDeleteRedundant"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DialogImport from './dialogImport.vue'
import DialogDeleteRedundant from '@/views/data-source/dialogDeleteRedundant.vue'
import { deduplicateObjectArray } from '@/utils'

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

const dialogDeleteRedundantVisible = ref(false)
const closeDialogDeleteRedundant = () => {
  dialogDeleteRedundantVisible.value = false
}

/**
 * 删除重复行
 */
const onClickDeleteRedundant = () => {
  dialogDeleteRedundantVisible.value = true
}

const filterRedundant = (val: string) => {
  // TODO 多选去重

  // 单选去重
  console.log('去重字段', val)
  data.value = deduplicateObjectArray(data.value, val)
}

const handleDataChange = (val: any) => {
  data.value = val
  columnPropList.value = [...Object.keys(val[0])]
}

// watch(
//   dialogImportVisible,
//   (val) => {
//     console.log('dialogImportVisible', val)
//   }
// )
</script>

<style scoped lang="scss">
</style>
