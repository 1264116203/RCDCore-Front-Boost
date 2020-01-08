<template>
  <div>
    <button v-if="!isDisable" class="ant-btn ant-btn-primary" @click="onAdd">
      添加
    </button>
    <a-form :form="form">
      <a-form-item v-for="(record, tableIndex) in tableData" v-show="false" :key="tableIndex">
        <a-input v-decorator="[`tableData[${tableIndex}].id`, { initialValue: record.id }]" />
      </a-form-item>
      <a-table :columns="columns" :data-source="tableData" :pagination="false" bordered class="inner-table">
        <template
          v-for="(col, index) in columns"
          :slot="col.dataIndex"
          slot-scope="text, _, tableIndex"
        >
          <div :key="index">
            <a-form-item>
              <a-input
                v-decorator="[`tableData[${tableIndex}][${col.dataIndex}]`, {
                  rules: [
                    { required: true, message: `请输入必填项` },
                  ],
                  initialValue: text
                }]"
                style="margin: -5px 0" :disabled="isDisable"
              />
            </a-form-item>
          </div>
        </template>
        <template #operations="text, record, index">
          <a-popconfirm v-if="!isDisable" title="确定要删除吗?" @confirm="() => tableData.splice(index, 1)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<script>
const EmptyData = {
  id: '',
  dictKey: '',
  dictValue: '',
  dictType: '',
  remark: ''
}
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    isDisable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    columnKeys() {
      return this.columns.map(column => column.dataIndex)
    }
  },
  created() {
    this.form.setFieldsValue(this.tableData)
  },
  methods: {
    onAdd() {
      this.tableData.push({ ...EmptyData })
    },
    handleChange(value, dataIndex, index) {
      this.tableData[index][dataIndex] = value
    },
    validateRequired(text, dataIndex) {
      if (dataIndex !== 'remark') {
        return text
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less">
  .inner-table {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
</style>
