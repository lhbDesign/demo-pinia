

<template>
  <div>
    <div class="top-nav">
      <router-link
        to="/"
      >页面1</router-link>
      <router-link
        to="/stand"
      >页面2</router-link>
    </div>
    <router-view>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import home from './components/home/Home.vue'

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.top-nav{
  width: 200px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
