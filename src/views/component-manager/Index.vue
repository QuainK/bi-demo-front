<template>
  <!--模块容器-->
  <div class="module">
    <!--横向分成三个部分-->
    <!--左侧，表格字段列表-->
    <!--中间，图表类型和图表参数-->
    <!--右侧，图表实时展示区-->

    <!--左侧，表格字段列表-->
    <div class="module-left">
      <!--表格字段列表-->
      <div class="table-column-list">
        <draggable
          class="list-group"
          :list="columns"
          group="people"
          itemKey="name"
        >
          <template #item="{ element, index }">
            <div class="table-column-item">{{ element.name }}</div>
          </template>
        </draggable>
        <!--表格字段单项-->
        <!--<div v-for="(column, index) in columns" :key="index" class="table-column-item">-->
        <!--  {{ column }}-->
        <!--</div>-->
      </div>
    </div>

    <!--中间，图表类型和图表参数-->
    <div class="module-center">
      <!--图表类型区块-->
      <div class="chart-category">
        <h3 class="submodule-title">
          图表类型
        </h3>
        <div class="chart-category-list">
          <div v-for="n in 10" class="chart-category-item">
            {{ n === 1 ? '柱状图' : '' }}
          </div>
        </div>
      </div>
      <!--图表参数-->
      <div class="chart-param">
        <h3 class="submodule-title">
          图表参数
        </h3>
        <!--参数都放在一个表单里-->
        <el-form>
          <el-form-item class="chart-param-item" label="维度">
            <draggable
              class="draggable"
              :list="dimension"
              group="people"
              itemKey="name"
              @change="change"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element.name }}</div>
              </template>
            </draggable>
          </el-form-item>

          <el-form-item class="chart-param-item" label="指标">
            <draggable
              class="draggable"
              :list="amount"
              group="people"
              itemKey="name"
              @change="change"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element.name }}</div>
              </template>
            </draggable>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--右侧，图表实时展示区-->
    <div class="module-right">
      <!--图表DOM容器-->
      <div ref="chartDom" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDataSourceStore } from '@/store/date-resource'
import { nextTick, ref } from 'vue'
import draggable from 'vuedraggable'
import * as echarts from 'echarts'

const store = useDataSourceStore()
const { modifiedList: sourceList } = storeToRefs(store)

const columns = ref<{ name: string }[]>([])
if (sourceList.value.length) {
  columns.value = (Object.keys(sourceList.value[0]) ?? []).map((item) => ({ name: item }))
}

const dimension = ref([])
const amount = ref([])

const chartDom = ref()
let chart = null

const change = async () => {
  // console.log(dimension.value, amount.value)
  await nextTick()
  if (!chart) {
    chart = echarts.init(chartDom?.value)
  }
  chart?.clear()

  let xData = []
  let yData = []

  sourceList.value.forEach((item) => {
    const dimensionName = dimension.value[0]?.name ?? ''
    const amountName = amount.value[0]?.name ?? ''
    // console.log('dimensionName', dimensionName, 'amountName', amountName, item[dimensionName], item[amountName])
    xData.push(item[dimensionName] ?? 0)
    yData.push(item[amountName] ?? 0)
  })

  // console.log('xData', xData)
  // console.log('yData', yData)

  chart?.setOption({
    xAxis: {
      type: 'category',
      data: xData ?? []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: true
      }
    ]
  })
}
</script>

<style scoped lang="scss">
.table-column-list {
  width: 200px;
}
.table-column-item {
  display: flex;
  flex-direction: column;
}
.table-column-item {
  margin-bottom: 4px;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  user-select: none;
  cursor: grab;
}
.module-center {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}
.submodule-title {
  padding: .5em 0;
}
.chart-category-list {
  display: flex;
  flex-wrap: wrap;
  width: (50+4)*4px;
}
.chart-category-item {
  width: 50px;
  height: 50px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.chart-param-item {
  min-width: 200px;
  min-height: 50px;
  border: 1px solid #ccc;
  border-radius: 4px;
  .draggable {
    min-width: 150px;
    min-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #eee;
  }
}
.chart {
  width: 1200px;
  height: 900px;
}
</style>
