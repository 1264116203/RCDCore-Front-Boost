<template>
  <a-card style="height: 100%">
    <h3>表单示例</h3>

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
      <a-form-item label="表单布局">
        <a-radio-group v-model="formLayout" default-value="horizontal">
          <a-radio-button value="horizontal">
            横向
          </a-radio-button>
          <a-radio-button value="vertical">
            纵向
          </a-radio-button>
          <a-radio-button value="inline">
            行内
          </a-radio-button>
        </a-radio-group>
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
      formLayout: 'horizontal'
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
        : {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
