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
        <a-form-item label="字典编号">
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

        <a-form-item label="字典键值">
          <a-input
            v-decorator="['key', { rules: [{ required: true, message: '请输入字典键值' }] }]"
            placeholder="请输入字典键值"
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

const EmptyUserForm = {
  code: '',
  name: '',
  key: '',
  sort: '',
  remark: ''
}

export default {
  mixins: [modelMixin],
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDict(id).then(res => {
          const requestData = res.data

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
    }
  }
}
</script>
