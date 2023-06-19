<template>
  <el-dialog
    v-model="dialogVisible"
    title="删除重复行"
    center
    @close="closeDialog"
  >
    选择字段：
    <el-select
      v-model="selected"
      filterable
      clearable
    >
      <el-option
        v-for="item in props.columns"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

    <!--弹窗底部-->
    <template #footer>
      <!--按钮容器-->
      <div class="form-dialog-bottom">
        <!--取消按钮-->
        <el-button :icon="CloseBold" @click="handleCancel">取消</el-button>
        <!--确定按钮-->
        <el-button type="primary" :icon="Select" @click="handleConfirm">确定</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CloseBold, Select } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean,
  columns: string[]
}>()

const emits = defineEmits([
  'close',
  'filter'
])

// 弹窗显示隐藏
// props.visible由父组件维护，子组件不能直接修改，dialogVisible由子组件维护
const dialogVisible = ref<boolean>(props.visible)

const closeDialog = () => {
  dialogVisible.value = false
  emits('close')
  selected.value = ''
}

const selected = ref<string>(props.columns[0])

const handleCancel = () => {
  closeDialog()
}

const handleConfirm = () => {
  emits('filter', selected.value ?? '')
  closeDialog()
}

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
  },
)
</script>

<style scoped lang="scss">
</style>
