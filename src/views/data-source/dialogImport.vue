<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入数据"
    center
    @close="closeDialog"
  >
    <el-upload
      ref="upload"
      action="#"
      drag
      :limit="1"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
      :on-exceed="handleExceed"
    >
      上传文件，支持xlsx, xls
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { genFileId, UploadFile, UploadProps, UploadRawFile } from 'element-plus'
import * as x from 'xlsx'
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean,
}>()

const emits = defineEmits([
  'change',
  'close'
])

// 弹窗显示隐藏
// props.visible由父组件维护，子组件不能直接修改，dialogVisible由子组件维护
const dialogVisible = ref<boolean>(props.visible)

const upload = ref()

/**
 * 覆盖文件
 */
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**
 * 文件发生变化
 * 比如首次上传、重新上传等
 */
const handleChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw as Blob

  const reader = new FileReader()
  reader.onload = (e) => {
    const buffer = e.target!.result
    const workbook = x.read(buffer, { type: 'array' })
    const sheetName = workbook.Sheets[workbook.SheetNames[0]]
    const json = x.utils.sheet_to_json(sheetName)
    console.log('json', json)
    emits('change', json)
  }
  reader.readAsArrayBuffer(file)

  closeDialog()
}

const closeDialog = () => {
  dialogVisible.value = false
  emits('close')
  upload.value!.clearFiles()
}

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    // console.log('props.visible', props.visible, dialogVisible.value)
  },
)
</script>

<style scoped lang="scss">
</style>
