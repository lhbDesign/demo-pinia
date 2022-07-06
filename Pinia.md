# 初识 Pinia

## 为什么使用pinia？

- pinia 是一种全局状态管理工具，其底层其实是对 Vue 自身状态的一种高度封装，本期我们主要讨论 pinia 配合 Vue3 的使用， 在 vue3 中， pinia的全局状态也是基于 reactive 达成的一种 代理对象，

## 和 vuex 的区别？

- 相对于vuex，对 ts的支持更加友好，具有可靠的类型推断。
- 支持多个store协同。
- 去除 mutations，只有 state，getters，actions。
- 无模块嵌套，只有 store，store 之间可以自由使用，更好的代码分割；

## 如何使用？

### 安装

- 使用vite 构建项目

  ```
  npm init vite@latest my-vue-app -- --template vue
  ```

  选择 vue ---> vue + ts

- 项目中添加 pinia

  ```
  npm install pinia
  ```

- 目录结构

  - src

    - api

    - assets
    - components
      - Home.vue
    - store
      - index.ts

  > store 为全局仓库定义处，使用的时候 都需要从次数引入，可以多人维护一个，也可以每个人单独维护一个自己的store，即在自己负责的组件或模块中，同此全局仓库的定义方法和使用方法相同，只在引入的时候使用不同的仓库名即可。

- 挂载 pinia

```javascript
/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'

const pinia = createPinia()
const app = createApp(App);

app.use(pinia);
app.mount('#app');

```

- 使用

> 引入的时候，一共有一下几种分发

```javascript
// 在使用前需要先实例化
import {mainStore} from './../store/index'
const store = mainStore();
```

1. 直接解构
   - 会失去响应式
   - 可以解构 actions 中的方法
   
2. 使用 点语法访问
   - 可以配合计算属性做进一步处理
   - 可以访问到 getter 和 actions
   
3. 使用 storeToRefs
   - 解构以后直接可以绑定为响应式
   - 不能解构 actions 中的方法
   
4. $path

   - 可以使用 此方法直接对 store中的多个数据进行更改，接收一个对象或一个回调函数，回调函数接收一个参数（state），可以分别对状态里的某个集合进行指定更改，而不是从新赋值，使用对象的形式只能从新赋值

   ```javascript
   store.$patch({
     counter: store.counter + 1,
     name: 'Abalam',
   })
   cartStore.$patch((state) => {
     state.items.push({ name: 'shoes', quantity: 1 })
     state.hasChanged = true
   })
   ```

5. $state

   - 用于替换整个状态， 也可以使用 store.state.value = {} 来替换

   ```javascript
   store.$state = { counter: 666, name: 'Paimon' }
   store.state.value = {}
   ```

- 方法

  > 在 getter 和actions 中 都可以通过 this 访问到当前 pinia中的 其他 getter 和 actions中的函数，实现相互调用

  1. pinia中的 getter

     -  getter 和 Vue 中的计算属性几乎一样，在获取 State值之前做一些逻辑处理, 会缓存上一次的值，如果没有更新，则只会调用一次
     - 使用的时候 getter 和 state 导入的方法是一样的，因为getter 只是将我们在其中定义的变量包装了一层 proxy 打入到 state中，但 *如果getter 使用了高阶函数，返回了一个函数， 在使用的时候，导入方法同 actions*
     - 通过以下第二个方式的调用，也可以实现通过传值的形式，对store中的值进行修改，但不建议这样做，修改的逻辑尽量还是放在actions中

     ```javascript
      // 通过getter 获得计算以后的数据
     getters: {
         // 获取计算以后的属性
         getData(state):boolean{
             return !this.data.msg
         },
             // 通过传值的方式获取计算以后的属性
             getCurrentData(state){
                 return (bool:boolean) => {
                     return this.data.msg = bool
                 }
             }
     }
     ```

  2. pinia中的 actions

     - 支持异步async的使用，通过 this的方式直接访问 state中定义的状态及修改状态

     ```javascript
     import { mainStore } from '../../material_show/pinia'
     actions: {
         setMainStore() {
             //可以直接引入其他仓库的pinia，获取其值或调用getter和actions
             ++mainStore().stuRefresh;
             ++mainStore().parRefresh;
         },
             // 更改用户登录状态
             changeUserStatus(bool:boolean){
                 this.userStatus = bool;
             },
                 // 更新教师信息
                 updateTeacher(options:teacherType){
                     this.teacherDetail = {...options};
                 },
     }
     ```

### 数据持久化

- 使用插件 pinia-plugin-persist 可以辅助实现数据持久化功能。
  - 安装  npm i pinia-plugin-persist --save
- 使用  入口文件注册

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
const app = createApp(App);

app.use(pinia);
app.mount('#app');

```

- 对应的 store中 配置persist

> 数据默认存在 sessionStorage 里，并且会以 store 的 id 作为 key。 以下案例中，存储得到的格式便是
>
> key:main  value:{"stuRefresh":4,"parRefresh":1,"data":{"name":"jack","msg":false}}

```javascript
import { defineStore } from 'pinia'
import getUrl from './../api/comment.js'
interface IMainStore {
    stuRefresh: number
    parRefresh: number
    data:{
      name:string,
      msg:boolean
    }
}

export const mainStore = defineStore('main', {
    state: (): IMainStore => {
        return {
            stuRefresh: 1,
            parRefresh: 1,
            data:{
              name:'jack',
              msg:true
            }
        }
    },
    // 通过getter 获得计算以后的数据
    getters: {
      // 获取计算以后的属性
      getData(state):boolean{
        return !this.data.msg
      },
      // 通过传值的方式获取计算以后的属性
      getCurrentData(state){
        return (bool:boolean) => {
          return this.data.msg = bool
        }
      }
    },
    // 通过actions 修改仓库的数据
    actions: {
      async changeStuRefresh(){
        const res = await getUrl()
        // actions 中 可以使用异步
        console.log('res',res);
        this.stuRefresh++
      }
    },
    // 使用本地存储，默认存放在sessionStorage 
    persist:{
      enabled:true，
       // 配置本仓库的key 及存储位置, 和指定 持久化数据
      strategies:[
        {
          key:'my_home',
          storage:localStorage
        },
        // 可以用过配置 ptah 来指定数据持久化
        {
          paths:[]
        }
      ]
    }
   }
})
```

- 在多个store存储的过程当中，没有使用到的store不会存储，第一次加载以后的store才会存储（测试过程中是第一次更新数据以后才会存储，也就是初始数据不会存储），所以在夸模块开发的时候，使用本地存储要先进行判定，或在对应模块加载以后获取。
- 在persist 配置 strategies， 可以对 key 进行从新设置，也可以设置存储位置，通过配置 path 指定存储化的数据，path是一个数组【‘key’，key‘’】，里面包含本仓库 state中 需要持久存储的key
- `注意：` 如果使用了 路由， 在页面跳转以后，再跳转回来，本地数据则不会根据页面的交互再次更新，使用路由的情况下 建议配置 keep-alive

### 全局单仓库

- 我们可以使用pinia在全局定义一个 store，让所有项目开发者共同来维护

```javascript
/store/index.ts

import { defineStore } from 'pinia'
import getUrl from './../api/comment.js'
// 这里引入了一个 promise ，以验证异步
interface IMainStore {
    stuRefresh: number
    parRefresh: number
    data:{
      name:string,
      msg:boolean
    }
}

export const mainStore = defineStore('main', {
    state: (): IMainStore => {
        return {
            stuRefresh: 1,
            parRefresh: 1,
            data:{
              name:'jack',
              msg:false
            }
        }
    },
    // 通过getter 获得计算以后的数据
    getters: {
      // 获取计算以后的属性
      getData():boolean{
        return !this.data.msg
      },
      // 通过传值的方式获取计算以后的属性
      getCurrentData(){
        return (bool:boolean) => {
          return this.data.msg = bool
        }
      }
    },
    // 通过actions 修改仓库的数据
    actions: {
      async changeStuRefresh(){
        const res = await getUrl()
        // actions 中 可以使用异步
        console.log('res',res);
        this.stuRefresh++
      }
    }
})
```

```javascript
/components/Home.vue

<template>
  <div class="home-container">
    <div>测试页面</div>
    <div>展示变化数据 {{showID}}</div>
    <div>展示toRef数据 {{stuRefresh}}</div>
    <div>
      <button @click="clickHandler">调试按钮</button>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue'
import {mainStore} from './../store/index'
export default defineComponent({
  setup() {
    const store = mainStore();
    const { stuRefresh } = storeToRefs(store)
    const {changeStuRefresh} = store;
    const showID = computed(()=>{
      return store.stuRefresh
    })
    const clickHandler = () => {
      changeStuRefresh()
    }
    return{
      showID,
      clickHandler,
      stuRefresh
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

```

### 多仓库协同

- 我们可以在每一个开发者的子模块中，通过pinia 分别定义一个自己的 store，自行维护，当其他人想要获取到某个模块的状态的时候，通过引入对方pinia的方式来获取

> 如果使用了路由切换，切换以后原路由的 pinia 的数据会丢失，可以使用 keep-alive 缓存路由组件， 可包装不同路由下store状态的维持

- 目录结构：

  src

  - api

  - assets

  - components
    
    - home
      - Home.vue
      - store
        - pinia.ts
    - stand
      - Stand.vue
      - store
        - pinia.ts
    
    - store
      - index.ts

- 代码结构：

```javascript
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
```



源码关键函数： getCurrentInstance  useStore  defineStore createPinia  1366 *pinia*._s.set(*$id*, store); 

***

引用链接：

https://juejin.cn/post/7057439040911441957

https://pinia.vuejs.org/introduction.html#comparison-with-vuex

数据持久化 https://juejin.cn/post/7049196967770980389

本demo github地址：

https://github.com/lhbDesign/demo-pinia  dev分支是多仓库的demo ， lasting 为数据持久化

