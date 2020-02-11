<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="800px"
      :title="title"
      :mask-closable="false"
      :ok-button-props="{ props: {disabled: isDisable} }"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-form ref="form" :form="form" class="d2-col-form"
              :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
              @submit="onSubmit"
      >
        <a-form-item label="字典名称" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入字典名称' }] }]"
            placeholder="请输入字典名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典编码">
          <a-input
            v-decorator="['code',{ rules: [{required: true,message: '请输入字典编码'}] }]"
            placeholder="请输入字典编码"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典排序">
          <a-input-number
            v-decorator="['sort', { rules: [{ required: true, message: '请输入字典排序' }] }]"
            placeholder="请输入字典排序"
            :disabled="isDisable"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="字典备注" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入字典备注"
            :autosize="{ minRows: 2, maxRows: 6 }"
            :disabled="isDisable"
          />
        </a-form-item>
      </a-form>
      <dict-table v-if="innerData" ref="dictTable" :columns="innerColumns" :table-data="innerData" :is-disable="isDisable" />
    </a-modal>
  </div>
</template>

<script>
import {
  add,
  getDict,
  update
} from '@/api/system/dict'
import { ModelMixin } from '@/components/mixins/ModelMixin'
import DictTable from '@/components/dict-table/DictTable'

const innerColumns = [
  {
    title: '字典项名*',
    dataIndex: 'dictKey',
    scopedSlots: { customRender: 'dictKey' }
  },
  {
    title: '字典项值*',
    dataIndex: 'dictValue',
    scopedSlots: { customRender: 'dictValue' }
  },
  {
    title: '类型*',
    dataIndex: 'dictType',
    scopedSlots: { customRender: 'dictType' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operations' },
    width: 100
  }
]

const EmptyFormData = {
  code: '',
  name: '',
  sort: '100',
  remark: ''
}

export default {
  components: { DictTable },
  mixins: [ModelMixin],
  data() {
    return {
      innerColumns,
      innerData: null
    }
  },
  methods: {
    open(type, id) {
      this.innerData = []
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDict(id).then(res => {
          const requestData = res.data
          this.innerData = requestData.itemList

          if (requestData.deptId) {
            requestData.currentDepts = requestData.deptId.split(',')
          }
          const formData = {}

          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    /** 添加信息 */
    onInsert() {
      this.doInsert(add)
    },
    /** 修改信息 */
    onUpdate() {
      this.doUpdate(update)
    },
    onDelete(index) {
      this.innerData.splice(index, 1)
    },
    getInnerData() {
      return this.$refs.dictTable.form.getFieldsValue().tableData
    },
    /** 修改信息 */
    doUpdate(api) {
      this.spinning = true
      const formData = this.getFormDataForUpdate()
      formData.id = this.id
      formData.itemList = this.getInnerData()
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据更新成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          this.spinning = false
        })
    },
    /** 添加信息 */
    doInsert(api) {
      this.spinning = true
      const formData = this.getFormDataForInsert()
      formData.itemList = this.getInnerData()
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据插入成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          this.spinning = false
        })
    }
  },
  reset() {
    this.id = null
    this.form.resetFields()
    this.$refs.dictTable.form.resetFields()
  }
}
</script>
<style scoped>
  .ant-table-wrapper {
    margin: 20px 0;
  }
</style>
