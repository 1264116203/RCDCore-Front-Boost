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
              <a-input-group
                v-if="col.dataIndex==='dictType'"
                compact
              >
                <a-select
                  v-decorator="[`tableData[${tableIndex}][${col.dataIndex}]`, {
                    rules: [
                      { required: true, message: `请输入必填项` },
                    ],
                    initialValue: text
                  }]"
                  :disabled="isDisable"
                  style="width: 100px"
                >
                  <a-select-option value="string">
                    String
                  </a-select-option>
                  <a-select-option value="boolean">
                    Boolean
                  </a-select-option>
                  <a-select-option value="number">
                    Number
                  </a-select-option>
                </a-select>
              </a-input-group>
              <a-input
                v-else
                v-decorator="[`tableData[${tableIndex}][${col.dataIndex}]`||dictType, {
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
const EmptyFormData = {
  id: '',
  dictKey: '',
  dictValue: '',
  dictType: 'String',
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
      this.tableData.push({ ...EmptyFormData })
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
    margin-top: 20px;
    .ant-form-item {
      margin-bottom: 0;
    }
  }
</style>
