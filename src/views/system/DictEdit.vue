<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="600px"
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
        <a-form-item label="字典编号" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['code',{ rules: [{required: true,message: '请输入字典编号'}] }]"
            placeholder="请输入字典编号"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入字典名称' }] }]"
            placeholder="请输入字典名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典排序">
          <a-input-number
            v-decorator="['sort', { rules: [{ required: true, message: '请输入字典排序' }] }]"
            placeholder="请输入字典排序"
            :disabled="isDisable"
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
      <a-table :columns="innerColumns" :data-source="innerData" bordered>
        <template
          v-for="(col,index) in innerColumns"
          :slot="col.dataIndex"
          slot-scope="text"
        >
          <div :key="col.index">
            <a-input
              style="margin: -5px 0"
              :value="text"
              :disabled="isDisable"
            />
          </div>
        </template>
        <template #operation="text, record">
          <a-popconfirm v-if="!isDisable" title="确定要删除吗?" @confirm="() => onDelete(record)">
            <a>  删除</a>
          </a-popconfirm>
        </template>
      </a-table>
      <dict-table :inner-columns="innerColumns" :inner-data="innerData" :is-disable="isDisable" @onAdd="onAdd" @onDelete="onDelete($event)" />
    </a-modal>
  </div>
</template>

<script>
import {
  add,
  getDict,
  update
} from '@/api/system/dict'
import { modelMixin } from '@/components/mixins/modelMixin'
import DictTable from '@/components/dict-table/DictTable'

const innerColumns = [
  {
    title: '字典项的键',
    dataIndex: 'key',
    scopedSlots: { customRender: 'key' }
  },
  {
    title: '字典项的值',
    dataIndex: 'value',
    scopedSlots: { customRender: 'value' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 100
  }
]

const EmptyUserForm = {
  code: '',
  name: '',
  sort: '',
  remark: ''
}
const EmptyData = {
  key: '',
  value: '',
  type: '',
  remark: ''
}
export default {
  components: { DictTable },
  mixins: [modelMixin],
  data () {
    return {
      innerColumns,
      innerData: []
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

          Object.keys(EmptyUserForm).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyUserForm })
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
    onAdd() {
      this.innerData.push(EmptyData)
    },
    onDelete(index) {
      this.innerData.splice(index, 1)
    },
    /** 修改信息 */
    doUpdate(api) {
      this.spinning = true
      const formData = this.getFormDataForUpdate()
      formData.id = this.id
      formData.itemList = this.innerData
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据更新成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.spinning = false })
    },
    /** 添加信息 */
    doInsert(api) {
      this.spinning = true
      const formData = this.getFormDataForInsert()
      formData.itemList = this.innerData
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据插入成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.spinning = false })
    }
  }
}
</script>
<style scoped>
.ant-table-wrapper{
  margin: 20px 0;
}
</style>
