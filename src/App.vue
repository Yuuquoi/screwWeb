<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'

</script>

<template>

  <div class="headerAndContent">

    <div class="header">
      <Header />
    </div>

    <div class="content">  
      <RouterView />
    </div>

  </div>

</template>

<style scoped lang="scss">
.headerAndContent{
  display: flex;
  overflow: hidden;
  .header {
    width: 5vw;
  }
  .content{
    width: 95vw;
  }
}


</style>
