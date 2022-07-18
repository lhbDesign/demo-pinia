<template>

  <div :class="className ? `${className} material_list` : 'material_list'">
    <el-image :style="imgStyle ?? 'height:150px'" :src="imgUrl" :fit="fit">
      <template #error>
        <div class="image-slot">
          <img v-if="empty" :src="empty" class="image-slot-empty" />
          <el-icon v-else><icon-picture /></el-icon>
        </div>
      </template>
    </el-image>
    <div>{{ title }}</div>
    <div>{{ teacherName }} | {{ school }}</div>
    <div class="use">
      <p>被我使用{{ teacherUseCount }}次</p>
      <p>平台老师使用{{ schoolUseCount }}次</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { list } from "./data";
export default defineComponent({
  name:'renderChangeList',
  components: {},
  setup() {
    

    return {
      list,
    };
  },
});
</script>

<style lang="less" scoped>
.material_list {
  display: flex;
  flex-direction: column;
  text-align: left;
  div {
    line-height: 1;
  }
  .use {
    display: flex;
    justify-content: flex-start;
    p {
      margin: 0 10px 0 0;
      font-size: 12px;
    }
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
    &-empty {
      width: 100%;
    }
  }
}
</style>