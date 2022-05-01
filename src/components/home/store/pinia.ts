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
    }
})