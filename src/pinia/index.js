import { getCurrentInstance, inject, toRaw, watch, unref, markRaw, effectScope, ref, isVue2, isRef, isReactive, set, onUnmounted, reactive, toRef, del, nextTick, computed, toRefs } from 'vue-demi';
// vue 插件注入
import { setupDevtoolsPlugin } from '@vue/devtools-api';
// markRaw 作用： 标记一个对象，使其永远不会再成为响应式对象
// effectScope 作用： 返回一个作用域(副作用生效的作用域)，使用 run 方法收集响应式依赖，使用 stop 方法终止所有的副作用， 目的就是更方便的管理副作用的收集和销毁

const piniaSymbol = (process.env.NODE_ENV !== 'production') ? Symbol('pinia') : Symbol();

function createPinia(){
  const scope = effectScope(true)
  const state = scope.run(()=>ref({}))
  let _p = []
  const pinia = markRaw({
    // 插件使用 install 作为入口
    install(app){
      pinia._a = app
      app.provide(piniaSymbol,pinia)
    },
    // 使用其他插件
    use(plugin){
      
    }
  })
}

export { createPinia }