<template>
  <div class="stand-container">
    <div>展示本组件store中的数据 {{stand.standData.count}}</div>
    <div>展示全局store 中的数据  {{store.stuRefresh}}</div>
    <div>展示home组件的数据 {{home.homeData.count}}</div>
    <div>
      <button @click="selfHandler">修改本store中的数据</button>
      <button @click="homeHandler">修改home-store中的数据</button>
      <button @click="mainHandler">修改全局store中的数据</button>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent,watch } from 'vue'
import {standStore} from './store/pinia'
import {homeStore} from './../home/store/pinia'
import {mainStore} from '@/store/index'

export default defineComponent({
  setup() {
    const stand = standStore();
    const store = mainStore();
    const home = homeStore();
    const selfHandler = () => {
      stand.changeRefresh()
    }
    const homeHandler = () => {
      home.changeRefresh()
    }
    const mainHandler = () => {
      store.changeStuRefresh()
      // 使用 $patch 批量修改状态，可以传入一个回调函数，接收一个参数 为 state， 则可以指定修改而不像使用对象的方式从新赋值
      /* store.$patch({
        stuRefresh:1234,
        data:{
          name:'xiaoli',
          msg:false
        }
      }) */
    }
    // 使用watch 查看对应 pania 上的全部状态
    watch(
      store,
      (state)=>{
        console.log('state',state)
      },
      { deep: true }
    )
    return{
      stand,
      home,
      store,
      selfHandler,
      homeHandler,
      mainHandler
    }
  },
})
</script>

<style lang="less" scoped>
.stand-container{
  width: 500px;
  height: 500px;
  border: 1px solid orangered;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  button{
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>