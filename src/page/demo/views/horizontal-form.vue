<template>
  <a-card style="height: 100%">
    <h3>纵向表单左边文字固定宽示例</h3>

    <a-card>
      <div class="markdown">
        <h2 id="-">
          概述
        </h2>
        <p>纵向表单列，自定义左边固定宽度，右边内容自由缩放</p>
        <ul>
          <li>
            表单布局：<a>layout</a>设置为<a>horizontal</a>，也是表单默认的布局
          </li>
          <li>
            <a>formItemLayout</a>：通过计算属性得到，与表单的<a>label-col</a>、<a>wrapper-col</a>绑定
          </li>
          <li>
            <a>labelCol</a>：通过计算属性<a>formItemLayout</a>中设置它的style属性，可以实现自定义左边固定宽度，与data中<a>itemWidth</a>绑定
          </li>
          <li>
            多列栅格式的表单排列方式：通过修改<a>ant-form-item</a>样式<a>width</a>的百分比调整列数。如:100%单列；50%两列；33%三列；以此类推。
          </li>
        </ul>
        <strong>注意：</strong>
        <br>
        标签宽度（px），绑定的是data中<a>itemWidth</a>，可以直观调整自己想要的宽度
        <br>
        <a>labelCol</a>中，不可以同时设置<a>style</a>和<a>span</a>，否则失去自定义固定宽度的效果
        <br>
        调整<a>width</a>为多列时，可以搭配设置<a>padding-left</a>的值使布局更完美一些
      </div>
      <h3>
        主要代码显示
      </h3>
      <textarea style="width:200px;height:200px">
        /* ---示例代码 a-form----*/
        <a-form
        layout="horizontal"
        :style="{width: formWidth + 'px'}"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        style="border: 1px dashed orange"
      />
      </textarea>
      <textarea style="width:200px;height:200px">
        /* ---示例代码 计算属性formItemLayout----*/
        computed: {
            formItemLayout() {
                return {
                    labelCol: { style: `min-width: ${this.itemWidth}px` },
                    wrapperCol: { style: { flex: '1 1 auto' } }
                }
            }
        }
      </textarea>
      <textarea style="width:200px;height:200px">
        /* ---示例代码 样式设置----*/
        .ant-form-horizontal{
            .ant-form-item{
                display: inline-flex;
                width: 100%;
                // padding-left: 1rem;
            }
        }
      </textarea>
    </a-card>

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

    <a-row>
      <a-form-item label="标签宽度（px）">
        <a-row :gutter="24">
          <a-col :span="5">
            <a-slider v-model="itemWidth" :min="64" :max="200" />
          </a-col>
          <a-col :span="5">
            <a-input-number v-model="itemWidth" :min="64" :max="200" />
          </a-col>
        </a-row>
      </a-form-item>
    </a-row>

    <a-card>
      <a-form
        layout="horizontal"
        :style="{width: formWidth + 'px'}"
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
      // 自定义labelCol的最小宽度
      itemWidth: 70
    }
  },
  computed: {
    formItemLayout() {
      return {
        labelCol: { style: `min-width: ${this.itemWidth}px` },
        wrapperCol: { style: { flex: '1 1 auto' } }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-horizontal{
  .ant-form-item{
    display: inline-flex;
    width: 100%;
    // padding-left: 1rem;
    // /deep/.ant-form-item-label{
    //   min-width: 70px;
    // }
  }
}
</style>
