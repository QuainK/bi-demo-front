<template>
  <!--模块容器-->
  <div class="module">
    <!--主体-->
    <div class="module-main">
      <!--菜单栏-->
      <div class="data-menu">
        <!--导入-->
        <el-button type="primary" @click="onClickImport">导入数据</el-button>

        <!--表格有数据时才显示-->
        <template v-if="originalList.length">
          <!--一些加工表格数据的菜单列表-->
          <el-menu
            mode="horizontal"
            :ellipsis="false"
            unique-opened
            :default-active="menuActiveIndex"
            class="menu-list"
          >
            <el-menu-item
              v-for="menuItem in menuList"
              :index="menuItem.name"
              @click="onClickMenuItem"
            >
              {{ menuItem.text }}
            </el-menu-item>
          </el-menu>
        </template>
      </div>

      <!--菜单内容-->
      <div v-show="menuActiveIndex !== 'null'" class="data-menu-detail">
        <!--取消确定按钮-->
        <div v-show="menuActiveIndex !== 'null'" class="data-menu-detail-button">
          <el-button type="info" @click="onClickToolCancel">取消</el-button>
          <el-button type="primary" @click="onClickToolConfirm">确定</el-button>
        </div>

        <!--表单-->
        <div class="data-menu-detail-form">
          <!--去重-->
          <div v-show="menuActiveIndex === menuList.deduplicate.name">
            <el-form inline>
              <el-form-item>
                <span class="form-item-label">字段</span>
                <el-select v-model="deduplicateColumn" clearable>
                  <el-option
                    v-for="column in columnPropList"
                    :key="column"
                    :value="column"
                    :label="column"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!--排序-->
          <div v-show="menuActiveIndex === menuList.sort.name">
            <el-form inline>
              <el-form-item>
                <span class="form-item-label">字段</span>
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
          <div v-show="menuActiveIndex === menuList.filter.name">
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
                <el-input v-model.trim="filter.content" placeholder="请输入值" clearable style="width: 300px" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!--表格容器-->
      <div class="table">
        <!--表格组件-->
        <el-table
          :data="currentPageList"
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
        <!--分页条组件-->
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="pageSizeList"
          :total="tableSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          class="pagination"
          @current-change="changePageNum"
          @size-change="changePageSize"
        />
      </div>
    </div>
  </div>

  <!--导入弹窗-->
  <DialogImport
    :visible="dialogImportVisible"
    @change="handleDataChange"
    @close="closeDialogImport"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import DialogImport from './dialogImport.vue'
import { deduplicateObjectArray, updateCurrentPageList } from '@/utils'
import { local } from '@/utils/storage'

// ---------- 导入 开始 ----------

// 显示导入弹窗
const dialogImportVisible = ref(false)
/**
 * 点击导入按钮
 */
const onClickImport = () => {
  // 显示导入弹窗
  dialogImportVisible.value = true
}
/**
 * 关闭导入弹窗
 */
const closeDialogImport = () => {
  dialogImportVisible.value = false
}

// ---------- 导入 结束 ----------

// ---------- 表格 数据 开始 ----------

// 原始数据列表
const originalList = reactive<any[]>([])
// 加工数据列表
const modifiedList = reactive<any[]>([])
// 当前页列表
const currentPageList = reactive<any[]>([])
// 字段列表（表头名）
const columnPropList = ref<string[]>([])
/**
 * 导入弹窗更新表格数据
 */
const handleDataChange = (val: any) => {
  // 更新原始表格数据
  originalList.length = 0
  Object.assign(originalList, JSON.parse(JSON.stringify(val)))
  // 更新加工表格数据
  modifiedList.length = 0
  Object.assign(modifiedList, JSON.parse(JSON.stringify(val)))
  // 更新表头数据
  columnPropList.value = [...Object.keys(val[0])]

  // 保存到本地缓存
  local.set('dataBody', val)
  local.set('dataHeader', columnPropList.value)

  // 更新分页列表
  pageNum.value = 1
  updateCurrentPage()
}

// ---------- 表格 数据 结束 ----------

// ---------- 表格 分页 开始 ----------

// 当前页码，从1开始
const pageNum = ref<number>(1)
// 每页大小
const pageSize = ref<number>(50)
// 每页大小的可选数值
const pageSizeList: number[] = [10, 20, 50, 100, 200]
// 列表总长度
const tableSize = ref<number>(0)
/**
 * 更新当前页列表
 */
const updateCurrentPage = () => {
  const val = updateCurrentPageList(modifiedList, pageNum.value, pageSize.value)
  currentPageList.length = 0
  Object.assign(currentPageList, JSON.parse(JSON.stringify(val)))
  tableSize.value = modifiedList.length
}
/**
 * 修改当前页码
 */
const changePageNum = () => {
  // 更新当前页码的列表数据
  updateCurrentPage()
}
/**
 * 修改页面大小
 */
const changePageSize = () => {
  // 更新当前页码的列表数据
  updateCurrentPage()
}
// ---------- 表格 分页 结束 ----------

// ---------- 去重 开始 ----------

// 去重字段
const deduplicateColumn = ref('')
// 去重
const executeDeduplicate = () => {
  // 单选去重
  modifiedList.length = 0
  if (!deduplicateColumn.value) {
    Object.assign(modifiedList, JSON.parse(JSON.stringify(originalList)))
  } else {
    modifiedList.push(...deduplicateObjectArray(originalList, deduplicateColumn.value))
  }
}

// ---------- 去重 结束 ----------

// ---------- 排序 开始 ----------

// 排序字段
const sortColumn = ref('')
// 排序方式
const sortMethod = ref('ascending')
// 排序方式常量表
const sortMethodList = reactive({
  ascending: { text: '升序', value: 'ascending' },
  descending: { text: '降序', value: 'descending' },
})
/**
 * 排序
 */
const executeSort = () => {
  // 按升降序排序
  const temp = modifiedList.sort((a, b) => {
    return sortMethod.value === 'ascending'
      ? a[sortColumn.value] - b[sortColumn.value]
      : b[sortColumn.value] - a[sortColumn.value]
  })
  const arr = JSON.parse(JSON.stringify(temp))
  // 更新表格数据
  modifiedList.length = 0
  Object.assign(modifiedList, arr)
}

// ---------- 排序 结束 ----------

// ---------- 筛选 开始 ----------

// 过滤条件列表
const filterList = ref([{
  // 字段名
  column: columnPropList.value[0],
  // 运算符
  operator: 'include',
  // 值，为什么不用value，防止和ref的.value混淆
  content: '',
}])
// 运算符常量表
const operatorList = ref({
  include: { name: 'include', text: '包含' },
  exclude: { name: 'exclude', text: '不包含' },
  prefix: { name: 'prefix', text: '开头是' },
  suffix: { name: 'suffix', text: '结尾是' },
})
/**
 * 过滤
 */
const executeFilter = () => {
  // 表格数据的筛选后结果
  let list = JSON.parse(JSON.stringify(originalList))

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
  modifiedList.length = 0
  Object.assign(modifiedList, JSON.parse(JSON.stringify(list)))
}

// ---------- 筛选 结束 ----------

// ---------- 菜单 通用 开始 ----------

// 当前激活的菜单
const menuActiveIndex = ref('null')
// 菜单项目
const menuList = reactive({
  deduplicate: { name: 'deduplicate', text: '去重', handler: executeDeduplicate },
  sort: { name: 'sort', text: '排序', handler: executeSort },
  filter: { name: 'filter', text: '筛选', handler: executeFilter },
})
/**
 * 点击菜单项目
 */
const onClickMenuItem = (item: { index: string }) => {
  closeAllMenu()
  menuActiveIndex.value = item.index ?? 'null'
}
/**
 * 关闭所有菜单
 */
const closeAllMenu = () => {
  menuActiveIndex.value = 'null'
}
/**
 * 点击菜单栏的取消按钮
 */
const onClickToolCancel = () => {
  // 关闭菜单栏和菜单内容
  closeAllMenu()
}
/**
 * 点击菜单栏的确定按钮
 */
const onClickToolConfirm = () => {
  // 按激活的菜单，调用对应功能函数
  const handler = menuList[<keyof typeof menuList>menuActiveIndex.value]?.handler
  if (handler) {
    handler()
  }
}

// ---------- 菜单 通用 结束 ----------

// ---------- 组件创建后立马执行 ----------

/**
 * 从本地缓存读取表格数据
 */
const updateTableFromLocal = () => {
  // 组件创建后，先读取浏览器本地缓存
  const header = local.get('dataHeader') ?? []
  const body = local.get('dataBody') ?? []
  // 更新原始表格数据
  originalList.length = 0
  Object.assign(originalList, JSON.parse(JSON.stringify(body)))
  // 更新加工表格数据
  modifiedList.length = 0
  Object.assign(modifiedList, JSON.parse(JSON.stringify(body)))
  // 更新表头数据
  columnPropList.value = header
}
updateTableFromLocal()
pageNum.value = 1
updateCurrentPage()
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
  align-items: center;
  width: 100%;
}
// 菜单列表
.menu-list {
  height: 50px;
  margin: 0 20px;
}
// 菜单内容
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
    margin-right: 1em;
  }
}
// 分页条
.pagination {
  justify-content: flex-end;
}
</style>
