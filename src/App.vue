<template>
  <div class="container">
    <DataImport />
    <DataShow />
  </div>
</template>

<script setup lang="ts">
import DataImport from '@/views/data-import.vue'
import DataShow from '@/views/data-show.vue'
</script>

<style scoped lang="scss">
.container {
  padding: 50px;
}
</style>
