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
        <a-form-item label="参数名称">
          <a-input
            v-decorator="['paramName',{ rules: [{required: true,message: '请输入参数名称'}] }]"
            placeholder="请输入参数名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="参数键名">
          <a-input
            v-decorator="['paramKey', { rules: [{ required: true, message: '请输入参数键名' }] }]"
            placeholder="请输入参数键名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="参数键值">
          <a-input
            v-decorator="[
              'paramValue',
              { rules: [{
                required: true,
                message: '请输入参数键值'
              }] },
            ]"
            placeholder="请输入参数键值"
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
  update,
  getParam
} from '@/api/system/param'
import { modelMixin } from '@/components/mixins/modelMixin'

const EmptyUserForm = {
  paramName: '',
  paramKey: '',
  paramValue: ''
}

export default {
  mixins: [modelMixin],
  data() {
    return {
    }
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getParam(id).then(res => {
          const requestData = res.data
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
    doCreation() {
      const formData = this.form.getFieldsValue()
      add(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    doUpdate() {
      const formData = this.form.getFieldsValue()
      formData.id = this.id
      update(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
