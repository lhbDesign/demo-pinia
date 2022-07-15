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
    <div v-if="checked !== undefined" class="checked-box">
      <el-checkbox v-model="check" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    IconPicture,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    className: String,
    imgStyle: String,
    fit: String,
    submitStatus: Number,
  },
  emits:['submit'],
  name: "materialList",
  setup(props, content) {
    const {
      data: {
        imgUrl,
        title,
        teacherName,
        school,
        checked,
        teacherUseCount,
        schoolUseCount,
        empty,
      },
      className,
      imgStyle,
      fit = "fill"
    } = props;
    const currentData = ref(props.data);
    const check = ref(checked);
    watch(
      ()=>check.value,
      (v)=>{
        currentData.value.checked = v
      }
    )
    watch(
      ()=>props?.submitStatus,
      ()=>{
        content.emit('submit',{
          data:currentData.value
        })
      }
    )
    return {
      imgUrl,
      check,
      className,
      fit,
      imgStyle,
      title,
      checked,
      teacherName,
      school,
      teacherUseCount,
      schoolUseCount,
      empty,
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
  .checked-box {
    text-align: right;
    margin-right: 5px;
    :deep(.el-checkbox) {
      height: 20px;
    }
  }
}
</style>
