<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="标题">
      <a-input v-model="form.title" />
    </a-form-model-item>
    <a-form-model-item label="消息类型">
      <a-radio-group v-model="form.type">
        <a-radio value="demo">
          demo（仅供示例，无处理状态）
        </a-radio>
        <a-radio value="demo-cmd">
          demo-cmd（示例命令，点击处理后打开页面）
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="摘要（小于200字）">
      <a-input v-model="form.summary" type="textarea" />
    </a-form-model-item>
    <a-form-model-item label="正文">
      <a-input v-model="form.payload" type="textarea" />
    </a-form-model-item>
    <a-form-model-item label="接收者">
      <a-checkbox-group v-model="form.receivers">
        <a-checkbox value="1123598821738675201" name="type">
          Admin
        </a-checkbox>
        <a-checkbox value="1123598821738675202" name="type">
          Hr
        </a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
    <a-form-model-item label="附加信息（业务ID等）">
      <a-input v-model="form.detailLink" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        发送
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import { sendNotification } from '@/api/notification/notification'

export default {
  name: 'NotificationSend',
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        title: '',
        type: '',
        summary: '',
        payload: '',
        receivers: [],
        detailLink: ''
      }
    }
  },
  methods: {
    onSubmit() {
      sendNotification(this.form)
        .catch(err => console.error(err))
        .finally(() => {
          this.$message.success('消息发送成功!')
        })
    }
  }
}
</script>
