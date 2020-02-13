<template>
  <div>
    <a-form ref="form" :form="form" class="d2-col-form"
            :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
    >
      <a-form-item label="头像" style="width: 60%" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
        <a-upload-dragger
          v-decorator="['avatar']"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="plus" />
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="姓名" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['realName', { rules: [
            { required: true, message: '请输入用户姓名' }
          ]}]"
          placeholder="请输入用户姓名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户名" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['name', { rules: [
            { required: true, message: '请输入用户名' }
          ]}]"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="手机号" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['phone', { rules: [
            { pattern:/^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码'}
          ]}]"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['email', { rules: [
            { pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
          ]}]"
          placeholder="请输入电子邮箱"
          type="email"
          allow-clear
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 24 }">
        <a-button type="primary" @click="onSubmit">
          提交
        </a-button>
        <a-button style="margin-left: 15px" @click="onCancel">
          清除
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/api/common'
export default {
  data() {
    return {
      type: 'info',
      form: this.$form.createForm(this),
      currentId: ''
    }
  },
  created() {
    this.doSwitch()
  },
  methods: {
    onSubmit() {
      const formData = {
        ...this.form.getFieldsValue(),
        id: this.currentId
      }
      updateUserInfo(formData).then(res => {
        this.$message.success('修改信息成功!')
      })
        .catch(error => { console.log(error) })
    },
    onCancel() {
      this.form.resetFields()
    },
    doSwitch() {
      getUserInfo().then(res => {
        const user = res.data
        this.currentId = user.id
        this.form.setFieldsValue({
          avatar: user.avatar,
          name: user.name,
          realName: user.realName,
          phone: user.phone,
          email: user.email
        })
      })
    } }
}
</script>

<style>

</style>
