<template>
  <div class="container">
    <!--路由切换按钮-->
    <div style="margin-bottom: 10px">
      <el-button @click="onButtonClick('/')">home</el-button>
      <el-button @click="onButtonClick('/data-source')">data-source</el-button>
    </div>

    <!--模块路由视图-->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

const onButtonClick = (path: string = '/') => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
