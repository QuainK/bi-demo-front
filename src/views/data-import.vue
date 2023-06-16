<template>
  <div class="box">
    <div class="upload">
      <el-upload
        ref="upload"
        action="#"
        drag
        :limit="1"
        :auto-upload="false"
        :on-change="handleChange"
        :on-exceed="handleExceed"
      >上传文件
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { genFileId, UploadFile, UploadProps, UploadRawFile } from 'element-plus'
import * as x from 'xlsx'
import { ref } from 'vue'

const emits = defineEmits([
  'change'
])

const upload = ref()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw as Blob

  const reader = new FileReader()
  reader.onload = (e) => {
    const buffer = e.target!.result
    const workbook = x.read(buffer, { type: 'array' })
    const sheetName = workbook.Sheets[workbook.SheetNames[0]]
    const json = x.utils.sheet_to_json(sheetName)
    // console.log('json', json)
    emits('change', json)
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload {
  width: 300px;
}
</style>
