import { defineStore } from "pinia";

export interface renderListType {
  id: number;
  name: string;
  resType: number;
  region: string;
  duration: string;
  poster: string;
  url: string;
  customDirectoryId: number;
  customSystemId: number;
  fileType: string;
  author: string;
  downloadCount: string;
  useCount: string;
  viewCount: string;
  pdfSrc: string;
  title: string;
  jsonData: string | null;
  showSchoolTag: boolean;
}

export const renderListData = defineStore("renderListData", {
  state: () => {
    return {
      mapList:[

      ]
    };
  },
  getters: {

  },
  actions: {
    // 拿到指定的 已选中的值 进行对比 去对照是否添加 已选择的参数
    
  },
});
