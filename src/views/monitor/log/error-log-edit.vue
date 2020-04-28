<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="800px"
      title="查看"
      centered
      :closable="true"
      :mask-closable="true"
      :ok-button-props="{ props: {disabled: isDisable} }"
      :footer="null"
      @cancel="onCancel"
    >
      <a-form ref="form" :form="form" class="d2-col-form"
              :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="服务id">
          <a-input
            v-decorator="['serviceId',{ rules: [{required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="服务host">
          <a-input
            v-decorator="['serverHost', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="服务ip">
          <a-input
            v-decorator="['serverIp', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="软件环境">
          <a-input
            v-decorator="['env', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="请求方法">
          <a-input
            v-decorator="['method', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="请求接口">
          <a-input
            v-decorator="['requestUri', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="日志时间">
          <a-input
            v-decorator="['createTime', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="用户代理" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['userAgent', { rules: [{ required: true}] }]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="请求数据" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['params']"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :disabled="isDisable"
          />
        </a-form-item>
        <a-form-item label="堆栈信息" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['stackTrace']"
            :auto-size="{ minRows: 5, maxRows: 15 }"
            :disabled="isDisable"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  getErrorLogs
} from '@/api/logs'
import { ModelMixin } from '@/components/mixins/monitor/model-mixin'
import moment from 'moment'
const EmptyFormData = {
  serviceId: '',
  serverHost: '',
  serverIp: '',
  env: '',
  method: '',
  requestUri: '',
  createTime: '',
  userAgent: '',
  params: '',
  textarea: '',
  stackTrace: ''
}

export default {
  mixins: [ModelMixin],
  methods: {
    open(id) {
      this.formVisible = true
      getErrorLogs(id).then(res => {
        const requestData = res.data
        requestData.createTime = moment(requestData.createTime).format('YYYY-MM-DD HH:mm:ss')
        const formData = {}

        Object.keys(EmptyFormData).forEach(key => {
          formData[key] = requestData[key]
        })

        this.form.setFieldsValue(formData)
      })
    }
  }
}
</script>
