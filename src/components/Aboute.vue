
<template>
  <div class="home-container">
      <materialList
        v-for="(item,index) in list"
        :key="index"
        :data = 'item'
        className="materialList_item"
        imgStyle='height: 100px'
        fit='cover'
        :submitStatus='count'
        @submit="submitHandle"
      />
      <button @click="clickHandle">提交</button>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, reactive, ref, watch } from 'vue'
import materialList from './materialList.vue'
import { list } from './config'
export default defineComponent({
  components:{
    materialList
  },
  
  setup() {
    const count = ref(1)
    const obj = ref<Array<Record<any,any>>>([])
    const submitHandle = (v:any) => {
      console.log('参数',v.data,obj);
      obj.value.push(v.data)
    }
    watch(()=>count,()=>{
      console.log('obj',obj);
    })
    const clickHandle = () => {
      obj.value = []
      count.value = count.value + 1
    }
    return{
      list,
      count,
      submitHandle,
      clickHandle
    }
  },
})
</script>

<style  lang="less" scoped>
.home-container{
  width: 1000px;
  height: 700px;
  border: 1px solid #333;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.materialList_item{
  width: 200px;
  height: 200px;
  border: 1px solid gray;
  padding: 10px;
}
</style>