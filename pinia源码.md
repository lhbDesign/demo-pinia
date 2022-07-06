# pinia 源码解析

## 概述

- 上一篇我们已经大致了解了 pinia 的相关使用方法 以及 API 和如何使用 pinia 的插件， 这一次我们来看一下 pinia 在源码上是如何处理的， 这里我拆分出来了源码中的关键方法，将源码中 对 vue2 和 vue3 的考虑 ，开发模式 和 生产模式 的考虑， 热更新，CSR 和 SSR 以及插件 和 API 的注入等 诸多情况进行了删减，这里我们只考虑 vue3的情况， 把基础架构搭建了一下。

- 目的： 为更好的理解 pinia 底层是如何实现的，通过拆分源码，加深对响应式系统的数据结构设计的原理，以及拓宽思路。
- 实现：能够实现 state ，getters， 以及 actions 的响应式， 在末尾会贴出简化后的 60行代码，可以自己 用 vite 搭建一个 vue 的项目试着搞个 demo 看看。

> 此源码也引用了一起论坛上其他大神的诸多见解，在文章末尾会把链接贴出来，以供大家参考

## 写在之前

- 依赖
  - `vue-demi`: vue 的很多库 在编写的过程中 会依赖于 ‘vue-demi’ 这个库， 这个库中暴露了 很多用于提供给插件编辑者的便利方法，很多方法开发者在开发的过程中是使用不上的，也很少见，我在引用的时候，也很难查找到很多对应方法的资料或者 demo，对一些方法的理解比较浅显，希望有过经验的前辈可以多多指教。
  - `vue/devtools-api`： pinia 同时还引入了 vue 开发者工具库， 这个库的引入，可以让我们在浏览器的 vue 插件中 能够查看到 pinia store 的状态，这次我们在源码拆分的过程中没有把这个库加进去。
- 环境
  - `process.env.NODE_ENV `: pinia 对生产环境 和 开发环境做了区分， 就像 vue 中 对生产环境 和开发环境 给我们的 提示是不一样的一个道理，这里使用 process.env.NODE_ENV  === production 进行的判断，同样区分的代码量是很大的，区分以后要做很多处理，这里我们的源码也只针对开发环境。
- 结构
  - 在结构上面，和其他的包是一样的，dist 下 包含了几种不同的文件， 如 cjs，iife，mjs ，esm-browser针对用不同的模块化规范，以及生产环境和开发环境的版本，我们这里引用和查看的主要是 源码中的 esm-browser 版本

## 拆分

### 引用

- 在正式贴代码之前， 先分享一下思路， 这里我们使用插件的时候， 最先考虑的是这个插件实现的功能，插件的功能自然都是挂载在其实例上，原理也是比较简单，就是给 vue 的 app 实例全局 provide 进去，这样我们所有子模块便都能够访问到该实例。
- 这里我使用了几块进行处理， 三部分，第一部分是全局引用，第二部分是 createPinia， 第三部分是 defineStore。

### 全局引用

```javascript
// 计算属性得到的响应式对象是 ComputedRef，其原型上包含 effect 方法， 是通过 computed 注入的
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
// markRaw 作用： 标记一个对象，使其永远不会再成为响应式对象
// effectScope 作用： 返回一个作用域(副作用生效的作用域)，使用 run 方法收集响应式依赖，使用 stop 方法终止所有的副作用， 目的就是更方便的管理副作用的收集和销毁

let activePinia; // 主要是针对 ssr 的情况下 才会使用

// Sets or unsets the active pinia.   Used in SSR and internally when calling actions and getters ==> 针对 ssr
const setActivePinia = (pinia) => (activePinia = pinia)
// 首次 ssr 加载的时候 没有pinia 的情况下 注入
const getActivePinia = () => (getCurrentInstance() && inject(piniaSymbol)) || activePinia;
// 使用 Symbol 唯一值标记 pinia 实例
const piniaSymbol = (process.env.NODE_ENV !== 'production') ? Symbol('pinia') : Symbol();
```

### createPinia

```javascript
// 注册插件
function createPinia(){
  const scope = effectScope(true)
  // state 实际上就是根store 在组件使用时 使用 defineStore 来定义组件的 store， 实际上就是向这里 做 add 操作 是一个 reactive，在使用的时候 通过 id 拿到对应的 state
  const state = scope.run(()=>ref({}))
  // _p  用来缓存插件 会在创建 store 时 遍历缓存数组， 执行其中的插件方法
  let _p = []
  console.log('pinia插件注入',state,'+++',scope);
  const pinia = markRaw({
    // 插件使用 install 作为入口
    install(app){
      pinia._a = app
      app.provide(piniaSymbol,pinia)
    },
    // 使用其他插件 插件的调用，需要早 app.use（pinia） 之前， 这里也就能够看到为什么了。
    use(plugin){
      _p.push(plugin);
      return this
    },
    state,
    _p,
    _s: new Map(), // 存储每一个 store 的映射
    _e: scope,
    _a: null
  })
  return pinia
}
```

### defineStore

```javascript
/**
 * 
 * @param {*} idOptions  store id 一般为 string 标识本 store
 * @param {*} setup 配置项 { state，getters，actions...}
 * @param {*} setupOptions 
 */
function defineStore(idOptions,setup,setupOptions){
  let id;
  let options;
  // 获取配置项类型 当第二个参数传入的是函数的时候，则使用第三个参数为配置， 当只传入一个参数的时候， 则全部配置都包含在这个对象中
  const isSetupStore = typeof setup === 'function';
  // 获取 id 唯一值的类型 如果不是 string， 则获取 idOptions 中的 id
  if(typeof idOptions === 'string'){
    id = idOptions;
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOptions;
    id = idOptions.id
  }

  function useStore(pinia){
    // 获取当前实例
    const currentInstance = getCurrentInstance();
    // 通过 app 实例， 使用 inject 方法 引入 pinia
    pinia = currentInstance && inject(piniaSymbol)
    // 设置 pinia 没有实例的时候会走这里 设置当前活跃的是哪个pinia实例，当有多个pinia实例时，方便获取当前活跃的pinia实例 
    if(pinia) setActivePinia(pinia);
    pinia = getActivePinia()
    if(!pinia._s.has(id)){
      // 第一次 map 上没有id 这里进行初始化, 挂载 store
      createOptionsStore(id,options,pinia)
    }
    // 读取 根 store
    const store = pinia._s.get(id);
    console.log('store',store,pinia);
    return store
  };
  useStore.$id = id;
  return useStore
}

function createOptionsStore(id,options,pinia){
  const { state, actions, getters } = options;
  // 初始化 state 存储， 第一次的时候 是 undefined
  const initState = pinia.state.value[id]
  let store;
  //! 关键方法，createSetupStore 方法中调用这个方法， 拿到所有需要配置的 store 里面的 key， 进行针对性配置
  function setup(){
    if(!initState){
      // 添加 state
      pinia.state.value[id] = state ? state() : {};
    }
    // 通过一个新的 对象 避免直接操作 pinia.state.value , 使用 toRefs 展开引用
    const localState = toRefs(pinia.state.value[id]);
    // 合并 action
    return Object.assign(localState,actions,Object.keys(getters || {}).reduce((computedGetters,name)=>{
      computedGetters[name] = markRaw(computed(()=>{
        setActivePinia(pinia)
        const store = pinia._s.get(id)
        // 这里直接使用了 getters 中的方法， 返回一个改变了 this指向的原函数，并且把 store 实例传给了这个方法， 故在 getters 中可以接收一个参数就是 store， 并且不可以使用箭头函数
        return getters[name].call(store,store)
      }))
      return computedGetters
    },{}));
  }

  store = createSetupStore(id,setup,options,pinia)
    /* store.$reset = function $reset(){
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state,newState)
    })
  } */
  return store
}

function createSetupStore($id,setup,options,pinia){
  let scope
  // 获取配置项汇中的 state 是函数
  const buildState = options.state;
  // 获取 pinia 中当前的 store 第一次的时候是 undefined
  const initialState = pinia.state.value[$id];
  // 进行作用域包裹，获取需要处理的 store 中的 配置
  const setupStore = pinia._e.run(()=>{
    scope = effectScope();
    return scope.run(()=>setup())
  })
  // 装饰api
  const partialStore = {
    _p:pinia,
    $id
  }

  function wrapAction(name,fn){
    return function(){
      setActivePinia(pinia);
      console.log('函数执行了',this);
      const arg = Array.from(arguments);
      let ret
      try{
        console.log(this,'-------',store);
        ret = fn.apply(store,arg)
      }catch(err){
        console.log('err',err);
      }
      return ret
    }
  }

  // store 在这里 被初始化为 reactive
  const store = reactive(partialStore)
  pinia._s.set($id,store)
  // 遍历配置 进行处理
  for(const key in setupStore){
    const prop = setupStore[key]
    console.log('prop',key,'---',prop,isRef(prop),isComputed(prop),isReactive(prop));
    // 判断是否是 ref 的类型， 且是 getters 的类型， 这里处理选项中 getters
    if(isRef(prop) && !isComputed(prop)){
      //TODO 如果 state 没有值 进行处理 逻辑暂时没有细究
      if(!buildState){
        // 第一次 initialState 是 false 
        if(initialState){
          if(isRef(prop)){
            prop.value = initialState[key]
          }
        }else{
          pinia.state.value[$id][key] = prop;
        }
      }
    }else if (typeof prop === 'function'){
      //TODO 处理 actions 使用 源码中的wrapAction  key 是函数名  prop 是函数体
      setupStore[key] = wrapAction(key,prop)
      console.log('function',prop,key);
    }

  }
  //! 关键步骤， 改变 store 结构，将初始化的 store 平铺到源 store 上
  Object.assign(store,setupStore)
  Object.assign(toRaw(store),setupStore)
  Object.defineProperty(store,'_p',{
    enumerable:false
  })
  return store
}
```

## 精简 demo

- 可以直接在 vite 起一个 vue3 项目进行使用， 测试响应式动能

```javascript
import { getCurrentInstance, inject, markRaw, effectScope, ref, reactive, computed, toRefs } from 'vue-demi';
const piniaSymbol = Symbol('pinia')
function createPinia(){
  const scope = effectScope(true)
  const state = scope.run(()=>ref({}))
  const  pinia = markRaw({
    install(app){
      pinia._a = app
      app.provide(piniaSymbol,pinia)
    },
    _s: new Map(), 
    state
  })
  return pinia
}
function createOptionsStore(id,options,pinia){
  const { state, getters, actions } = options;
  const initState = pinia.state.value[id]
  let store;
  function setup(){
    if(!initState) pinia.state.value[id] = state()
    const localState = toRefs(pinia.state.value[id])
    return Object.assign(localState,actions,Object.keys(getters).reduce((prev,name)=>{
      prev[name] = markRaw(computed(()=>{
        const store = pinia._s.get(id)
        return getters[name].call(store,store)
      }))
      return prev
    },{}))
  }
  store = reactive({
    _p:pinia,
    $id:id,
  })
  pinia._s.set(id,store)
  const setupStore = setup()
  for(const key in setupStore){
    //TODO 处理 actions 和 getters 
    const prop = setupStore[key]
  }
  Object.defineProperty(store,'_p',{
    enumerable:false
  })
  Object.assign(store,setupStore)
  return store
}
function defineStore(id,options){
  function useStore(){
    const currentInstance = getCurrentInstance()
    const pinia =  currentInstance && inject(piniaSymbol)
    if(!pinia._s.get(id)){
      createOptionsStore(id,options,pinia)
    }
    const store = pinia._s.get(id)
    return store
  }
  useStore.$id = id
  return useStore
}
export {
  createPinia,
  defineStore
}
```

