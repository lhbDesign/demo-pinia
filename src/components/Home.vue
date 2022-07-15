<template>
  <div class="home">
    <propertySet
      :data='data'
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import propertySet from './propertySet.vue'
import data from './config'
export default defineComponent({
  components:{
    propertySet
  },
  setup() {
    return{
      data
    }
  },
})
</script>

<style lang="less" scoped>
.home{
  width: 300px;
  height: 300px;
  border: 1px solid #333;
  
}
</style>
