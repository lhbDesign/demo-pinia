
<template>
  <div class="home-container">
    <div>测试页面</div>
    <div>展示全局store数据 {{showID}}</div>
    <div>展示toRef数据 {{store.stuRefresh}}</div>
    <div>
      <button @click="clickHandler">调试按钮</button>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue'
import {mainStore} from '@/store/index'
export default defineComponent({
  setup() {
    const store = mainStore();
    // 如此解构将会失去响应式
    // const { stuRefresh,changeStuRefresh } = store;
    // 可以响应式
    const { stuRefresh,getData } = storeToRefs(store);
    // 如果getter 使用了高阶函数，返回了一个函数， 在使用的时候，导入方法同 actions
    const {changeStuRefresh,getCurrentData} = store;
    const showID = computed(()=>{
      return store.stuRefresh
    })
    const clickHandler = () => {
      changeStuRefresh();
      getCurrentData(false)
    }
    return{
      showID,
      clickHandler,
      stuRefresh,
      store
    }
  },
})
</script>

<style  scoped>
.home-container{
  width: 500px;
  height: 500px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
