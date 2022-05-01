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
    }
})