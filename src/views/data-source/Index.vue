<template>
  <!--模块容器-->
  <div class="module">
    <!--主体-->
    <div class="module-main">
      <!--菜单栏-->
      <div class="data-menu">
        <!--导入-->
        <el-button type="primary" @click="onClickUpload">导入数据</el-button>

        <!--表格有数据时才显示-->
        <template v-if="originalData.length">
          <el-button @click="onClickDeleteRedundant">删除重复行</el-button>
          <el-button @click="onClickSort">排序</el-button>
          <el-button @click="onClickFilter">筛选</el-button>
        </template>
      </div>

      <!--菜单详情-->
      <div v-show="toolBoxVisible" class="data-menu-detail">
        <!--取消确定按钮-->
        <div class="data-menu-detail-button">
          <el-button type="info" @click="onClickToolCancel">取消</el-button>
          <el-button type="primary" @click="onClickToolConfirm">确定</el-button>
        </div>

        <!--表单-->
        <div class="data-menu-detail-form">
          <!--排序-->
          <div v-show="toolVisible.sort">
            <el-form inline>
              <el-form-item>
                <span class="form-item-label">选择字段：</span>
                <el-select v-model="sortColumn">
                  <el-option
                    v-for="column in columnPropList"
                    :key="column"
                    :value="column"
                    :label="column"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <span class="form-item-label">排序方式</span>
                <el-select v-model="sortMethod">
                  <el-option
                    v-for="option in Object.values(sortMethodList)"
                    :key="option.value"
                    :value="option.value"
                    :label="option.text"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!--筛选-->
          <div v-show="toolVisible.filter">
            <el-form
              v-for="(filter, index) in filterList"
              :key="index"
              label-position="top"
              inline
            >
              <el-form-item :label="index === 0 ? '字段' : ''">
                <el-select v-model="filter.column" placeholder="请选择字段">
                  <el-option
                    v-for="column in columnPropList"
                    :key="column"
                    :value="column"
                    :label="column"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="index === 0 ? '运算符' : ''">
                <el-select v-model="filter.operator" placeholder="请选择运算符">
                  <el-option
                    v-for="operator in Object.values(operatorList)"
                    :key="operator.name"
                    :value="operator.name"
                    :label="operator.text"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="index === 0 ? '值' : ''">
                <el-input v-model.trim="filter.content" placeholder="请输入值" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!--表格数据预览-->
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
    </div>
  </div>

  <!--导入弹窗-->
  <DialogImport
    :visible="dialogImportVisible"
    @change="handleDataChange"
    @close="closeDialogImport"
  />

  <!--删除重复行弹窗-->
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
import { local } from '@/utils/storage'

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
  // columnPropList.value = [...Object.keys(val[0])].map(propName => propName.trim())

  local.set('dataBody', val)
  local.set('dataHeader', columnPropList.value)
}

// ---------- 筛选 开始 ----------

// 点击筛选按钮
const onClickFilter = () => {
  closeAllTool()
  toolBoxVisible.value = true
  toolVisible.filter = true
}

// 过滤条件列表
const filterList = ref([{
  // 字段名
  column: 'ID',
  // 运算符
  operator: 'include',
  // 值，为什么不用value，防止和ref的.value混淆
  content: '71',
}])
// 运算符常量列表
const operatorList = ref({
  include: { name: 'include', text: '包含' },
  exclude: { name: 'exclude', text: '不包含' },
  prefix: { name: 'prefix', text: '开头是' },
  suffix: { name: 'suffix', text: '结尾是' },
})
// 点击确定按钮
const onClickFilterConfirm = () => {
  // 表格数据的筛选后结果
  let list = JSON.parse(JSON.stringify(originalData))

  // 遍历筛选条件列表
  filterList.value.forEach((condition) => {
    list = list.filter((item: any) => {
      // 目标字符串
      const target = item[condition.column].toString()
      // 匹配子串
      const pattern = condition.content

      // 判断分支
      if (condition.operator === 'include' || condition.operator === 'exclude') {
        // 包含和不包含
        const result = target.includes(pattern)
        return condition.operator === 'include' ? result : !result
      } else if (condition.operator === 'prefix') {
        // 开头是
        return target.startsWith(pattern)
      } else if (condition.operator === 'suffix') {
        // 结尾是
        return target.endsWith(pattern)
      } else {
        // 啥都不是
        return false
      }
    })
  })

  // 更新表格
  data.length = 0
  Object.assign(data, JSON.parse(JSON.stringify(list)))
}

// ---------- 筛选 结束 ----------

const header = local.get('dataHeader') ?? []
const body = local.get('dataBody') ?? []

originalData.length = 0
Object.assign(originalData, JSON.parse(JSON.stringify(body)))
data.length = 0
Object.assign(data, JSON.parse(JSON.stringify(body)))
columnPropList.value = header

const toolBoxVisible = ref(false)
const toolVisible = reactive<{ [prop: string]: boolean }>({
  deleteRedundant: false,
  sort: false,
  filter: false,
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
  } else if (toolVisible.filter) {
    onClickFilterConfirm()
  }
}

const onClickSort = () => {
  closeAllTool()
  toolBoxVisible.value = true
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
// 模块容器
.module {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
}
// 主体
.module-main {
  flex: auto;
  width: auto;
  min-width: 300px;
  height: 100%;
}
// 菜单栏
.data-menu {
  display: flex;
  width: 100%;
}
// 菜单详情
.data-menu-detail {
  margin: 10px 0;
}
// 取消确定按钮
.data-menu-detail-button {
  display: flex;
}
// 表单
.data-menu-detail-form {
  margin: 10px 0;
  .form-item-label {
    margin: 0 1em;
  }
}
</style>
