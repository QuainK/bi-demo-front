<template>
  <div>
    <el-button type="primary" @click="onClickUpload">导入数据</el-button>
    <template v-if="originalData.length">
      <el-button @click="onClickDeleteRedundant">删除重复行</el-button>
      <el-button @click="onClickSort">排序</el-button>
    </template>
  </div>

  <div v-show="toolBoxVisible" style="margin: 10px 0">
    <div>
      <el-button type="info" @click="onClickToolCancel">取消</el-button>
      <el-button type="primary" @click="onClickToolConfirm">确定</el-button>
    </div>
    <div style="margin: 10px 0">
      <template v-if="toolVisible.sort">
        <span style="margin: 0 1em">选择字段：</span>
        <el-select v-model="sortColumn">
          <el-option
            v-for="column in columnPropList"
            :key="column"
            :value="column"
            :label="column"
          />
        </el-select>
        <span style="margin: 0 1em">排序方式</span>
        <el-select v-model="sortMethod">
          <el-option
            v-for="option in Object.values(sortMethodList)"
            :key="option.value"
            :value="option.value"
            :label="option.text"
          />
        </el-select>
      </template>
    </div>
  </div>

  <el-table
    :data="data"
    stripe
    border
    style="margin: 10px 0;"
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
import { reactive, ref } from 'vue'
import DialogImport from './dialogImport.vue'
import DialogDeleteRedundant from '@/views/data-source/dialogDeleteRedundant.vue'
import { deduplicateObjectArray } from '@/utils'

const onClickUpload = () => {
  dialogImportVisible.value = true
}

// 原始数据
const originalData = reactive<any[]>([])
// 加工数据
const data = reactive<any[]>([])

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
  data.length = 0
  if (!val) {
    Object.assign(data, JSON.parse(JSON.stringify(originalData)))
  } else {
    data.push(...deduplicateObjectArray(originalData, val))
  }
}

const handleDataChange = (val: any) => {
  originalData.length = 0
  Object.assign(originalData, JSON.parse(JSON.stringify(val)))
  data.length = 0
  Object.assign(data, JSON.parse(JSON.stringify(val)))
  columnPropList.value = [...Object.keys(val[0])]
}

const toolBoxVisible = ref(false)
const toolVisible = reactive<{ [prop: string]: boolean }>({
  deleteRedundant: false,
  sort: false,
})
const closeAllTool = () => {
  Object.keys(toolVisible).forEach((key) => {
    toolVisible[key] = false
  })
}
const onClickToolCancel = () => {
  toolBoxVisible.value = false
  closeAllTool()
}
const onClickToolConfirm = () => {
  if (!toolBoxVisible.value) {
    return
  }
  if (toolVisible.sort) {
    const temp = data.sort((a, b) => {
      return sortMethod.value === 'ascending'
        ? a[sortColumn.value] - b[sortColumn.value]
        : b[sortColumn.value] - a[sortColumn.value]
    })
    const arr = JSON.parse(JSON.stringify(temp))
    data.length = 0
    Object.assign(data, arr)
  }
}

const onClickSort = () => {
  toolBoxVisible.value = true
  closeAllTool()
  toolVisible.sort = true
}
const sortColumn = ref('')
const sortMethod = ref('ascending')
const sortMethodList = reactive({
  ascending: { text: '升序', value: 'ascending' },
  descending: { text: '降序', value: 'descending' },
})

// watch(
//   dialogImportVisible,
//   (val) => {
//     console.log('dialogImportVisible', val)
//   }
// )
</script>

<style scoped lang="scss">
</style>
