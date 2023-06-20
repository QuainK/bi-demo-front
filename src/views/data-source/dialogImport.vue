<template>
  <!--弹窗容器-->
  <el-dialog
    v-model="dialogVisible"
    title="导入数据"
    center
    @close="closeDialog"
  >
    <!--链接框-->
    <div class="url-box">
      <!--URL输入框-->
      <el-input v-model.trim="dataUrl" disabled class="url-input" placeholder="请输入在线数据URL并点击右侧按钮导入" clearable />
      <!--导入按钮-->
      <el-button disabled class="url-button" type="primary" @click="onClickUrlDownload">
        在线导入
      </el-button>
    </div>

    <!--上传框-->
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
import * as dayjs from 'dayjs'

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

// 上传框DOM
const upload = ref()

// URL
const dataUrl = ref('')
// 点击在线导入按钮
const onClickUrlDownload = () => {
  if (!dataUrl.value) {
    return
  }
  console.log('点击在线导入按钮', dataUrl.value)
  // 将URL的文件下载成Blob
  // readFileBuffer(new Blob())
}

/**
 * 覆盖文件
 * 比如重复上传
 */
const handleExceed: UploadProps['onExceed'] = (files) => {
  // 清空待上传列表
  upload.value!.clearFiles()
  // 将本次选择的第一个文件拿出来
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // 放进待上传列表
  upload.value!.handleStart(file)
}

/**
 * 文件发生变化
 * 比如首次上传、重新上传等
 */
const handleChange = (uploadFile: UploadFile) => {
  // 读取文件流
  readFileBuffer(uploadFile.raw as Blob)
}

/**
 * 读取文件流
 */
const readFileBuffer = (file: Blob) => {
  // 初始化JS输入流
  const reader = new FileReader()
  // 输入流被加载的事件钩子函数
  // 里面的内容只是事先定义好，现在还没执行呢
  reader.onload = (e) => {
    // 输入流缓冲
    const buffer = e.target!.result
    // 读取xlsx文件，注意日期格式
    const workbook = x.read(buffer, { type: 'array', cellDates: true })
    // 获取表格文件名
    const sheetName = workbook.Sheets[workbook.SheetNames[0]]
    // 将该表格转换成JSON格式
    let json = x.utils.sheet_to_json(sheetName)
    // 封装日期时间格式
    json = json.map((row) => {
      Object.keys(row).forEach((prop) => {
        // console.log('prop', prop)
        if (row[prop] instanceof Date) {
          row[prop] = dayjs(row[prop]).format('YYYY-MM-DD')
        }
      })
      return row
    })
    // console.log('json', json)
    // 通知父组件，导入完成
    emits('change', json)
    // 读完了，关闭弹窗
    closeDialog()
  }

  // 输入流开始读
  reader.readAsArrayBuffer(file)
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  // 更新子组件状态
  dialogVisible.value = false
  // 通知父组件
  emits('close')
  // 清空待上传列表
  upload.value!.clearFiles()
}

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  },
)
</script>

<style scoped lang="scss">
.url-box {
  display: flex;
  margin-bottom: 20px;
  .url-input {
    flex: auto;
  }
  .url-button {
    flex: none;
    width: 100px;
    margin-left: 20px;
  }
}
</style>
