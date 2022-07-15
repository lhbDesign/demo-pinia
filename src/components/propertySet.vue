<template>
  <div>{{ title }}</div>
  <el-input
    v-model="text"
    :maxlength="maxLen"
    :placeholder="inputPlaceholder"
    show-word-limit
    type="text"
    @blur="inputBlurHandle"
  />
  <div>
    <div class="property_title">
      <div>引导语</div>
      <el-switch v-model="showGuide" />
    </div>
    <div class="property_guide-box" v-show="showGuide">
      <div
        v-for="item in checkData"
        :key="item.id"
        :class="
          item?.checked
            ? 'property_guide property_guide-checked'
            : 'property_guide '
        "
        @click="()=>{checkedHandle(item)}"
      >
        <div></div>
        <div>{{ item.title }}</div>
      </div>
    </div>
  </div>
  <div v-show="showMistakesBox">
    <div class="property_title">
      <div>错题重做</div>
      <el-switch v-model="showMistakes" />
    </div>
    <div v-show="showMistakes">
      最多重做
      <el-input-number
        v-model="count"
        :min="1"
        :max="10"
        @change="handleChange"
        size="small"
      />
      次
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "propertySet",
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
    },
    submitStatus:{
      type:Boolean,
      required:true
    }
  },
  emits:['submit'],
  setup(props, content) {
    // 默认值
    const text = ref("");
    const showGuide = ref(false);
    const showMistakes = ref(false);
    const showMistakesBox = ref(false);
    console.log("props", props.data);
    const {
      data: { inputData, changeData, selectData },
    } = props;

    // 输入框
    const title = inputData.title;
    const inputPlaceholder = inputData?.placeholder ?? "请输入";
    const maxLen = inputData?.maxLength ?? "";
    text.value = inputData?.value
    // 失焦事件
    const inputBlurHandle = (e) => {
      console.log('value',e.target.value);
      e.target.value ? '' : text.value = inputData?.value
    }
    // 引导语
    const checkboxGroup = ref([]);
    const checkData = ref(selectData.options);
    const checkedHandle = (item) => {
      console.log('item',item);
      item.checked = !item?.checked
    }   

    // 错题重做
    const count = ref(1);
    changeData ? (showMistakesBox.value = true) : "";

    const handleChange = (value) => {};
    console.log('props.submit',props.submitStatus);
    watch(
      () => props.submitStatus,
      (newValue,_) => {
        content.emit('submit',{
          text:text.value,
          checkData:checkData.value,
          mistakes:count.value
        })
      }
    )
    return {
      text,
      showGuide,
      showMistakes,
      title,
      inputPlaceholder,
      maxLen,
      showMistakesBox,
      handleChange,
      count,
      checkboxGroup,
      checkData,
      checkedHandle,
      inputBlurHandle
    };
  },
});
</script>

<style scoped>
.property_title {
  display: flex;
  align-items: center;
}
:deep(.el-input-number) {
  width: 80px;
}
.property_guide {
  border: 1px solid #000000;
  cursor: pointer;
}
.property_guide-box {
  display: flex;
}
.property_guide-checked{
  background-color: gray;
}
</style>
