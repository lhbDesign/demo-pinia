import { defineStore } from 'pinia'
interface IMainStore {
  standData:{
    count:number
  }
}

export const standStore = defineStore('stand', {
    state: (): IMainStore => {
        return {
          standData:{
              count:100
            }
        }
    },
    // 通过getter 获得计算以后的数据
    getters: {

    },
    // 通过actions 修改仓库的数据
    actions: {
      changeRefresh(){
        this.standData.count++
      }
    }
})