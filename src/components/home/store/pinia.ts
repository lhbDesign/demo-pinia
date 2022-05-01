import { defineStore } from 'pinia'
interface IMainStore {
  homeData:{
    count:number
  }
}

export const homeStore = defineStore('home', {
    state: (): IMainStore => {
        return {
            homeData:{
              count:0
            }
        }
    },
    // 通过getter 获得计算以后的数据
    getters: {

    },
    // 通过actions 修改仓库的数据
    actions: {
      changeRefresh(){
        this.homeData.count++
      }
    },
    // 使用本地存储，默认存放在sessionStorage
    persist:{
      enabled:true,
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
})