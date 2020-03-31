<template>
  <a-card style="height: 100%">
    <h3>纵向表单左边文字固定宽示例</h3>

    <a-row>
      <a-form-item label="表单宽度（px）">
        <a-row :gutter="24">
          <a-col :span="5">
            <a-slider v-model="formWidth" :min="60" :max="1200" />
          </a-col>
          <a-col :span="5">
            <a-input-number v-model="formWidth" :min="60" :max="1200" />
          </a-col>
        </a-row>
      </a-form-item>
    </a-row>

    <a-card>
      <a-form
        :style="{width: formWidth + 'px'}"
        :layout="formLayout"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        style="border: 1px dashed orange"
      >
        <a-form-item label="文字输入">
          <a-input />
        </a-form-item>
        <a-form-item label="数字输入">
          <a-input-number />
        </a-form-item>
        <a-form-item label="时间选择">
          <a-time-picker />
        </a-form-item>
        <a-form-item label="日期范围选择">
          <a-range-picker />
        </a-form-item>
        <a-form-item label="单选按钮">
          <a-radio>单选按钮</a-radio>
        </a-form-item>
        <a-form-item label="单选按钮组">
          <a-radio-group>
            <a-radio value="a">
              Hangzhou
            </a-radio>
            <a-radio value="b">
              Shanghai
            </a-radio>
            <a-radio value="c">
              Beijing
            </a-radio>
            <a-radio value="d">
              Chengdu
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="下拉选择">
          <a-select default-value="lucy">
            <a-select-option value="jack">
              Jack
            </a-select-option>
            <a-select-option value="lucy">
              Lucy
            </a-select-option>
            <a-select-option value="disabled" disabled>
              Disabled
            </a-select-option>
            <a-select-option value="Yiminghe">
              yiminghe
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-card>
  </a-card>
</template>

<script>
export default {
  name: 'Forms',
  data: function () {
    return {
      formWidth: 400,
      formLayout: 'horizontal',
      // 自定义labelCol的最小宽度
      itemWidth: 70
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
          labelCol: { style: `min-width: ${this.itemWidth}px` },
          wrapperCol: { span: 18 }
        }
        : {}
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-horizontal{
  .ant-form-item{
    display: inline-flex;
    width: 100%;
    // /deep/.ant-form-item-label{
    //   min-width: 70px;
    // }
  }
}
</style>
