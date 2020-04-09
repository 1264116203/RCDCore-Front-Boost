<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="标题">
      <a-input v-model="form.title" />
    </a-form-model-item>
    <a-form-model-item label="消息类型">
      <a-radio-group v-model="form.type">
        <a-radio value="1">
          notification
        </a-radio>
        <a-radio value="2">
          message
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="摘要">
      <a-input v-model="form.summary" type="textarea" />
    </a-form-model-item>
    <a-form-model-item label="正文">
      <a-input v-model="form.payload" type="textarea" />
    </a-form-model-item>
    <a-form-model-item label="接收者">
      <a-checkbox-group v-model="form.receivers">
        <a-checkbox value="1123598821738675201" name="type">
          张三
        </a-checkbox>
        <a-checkbox value="1123598821738675202" name="type">
          李四
        </a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
    <a-form-model-item label="详情链接">
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
