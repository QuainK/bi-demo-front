<template>
  <div class="container">
    <el-button @click="onButtonClick('/')">home</el-button>
    <el-button @click="onButtonClick('/data-source')">data-source</el-button>
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
  padding: 50px;
}
</style>
