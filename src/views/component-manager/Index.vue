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
        <!--表格字段单项-->
        <div
          v-for="n in 10"
          :key="n"
          class="table-column-item"
        >
          {{ n }}
        </div>
      </div>
    </div>

    <!--中间，图表类型和图表参数-->
    <div class="module-center">
      <!--图表类型区块-->
      <div class="chart-type"></div>
      <!--图表参数-->
      <div class="chart-param">

      </div>
    </div>

    <!--右侧，图表实时展示区-->
    <div class="module-right"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>
