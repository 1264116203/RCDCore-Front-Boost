<template>
  <div>
    <basic-container>
      <a-tabs default-active-key="info" @change="onChange">
        <a-tab-pane key="info" tab="个人信息">
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
                  { min: 2, max: 5, message: '姓名长度在2到5个字符' }
                ]}]"
                placeholder="请输入用户姓名"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="用户名" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-input
                v-decorator="['name', { rules: [
                  { whitespace: true, message:'用户名不能为空' }
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
        </a-tab-pane>
        <a-tab-pane key="password" tab="修改密码">
          <a-form ref="form" :form="passwordForm" class="d2-col-form"
                  :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="原密码" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-input v-decorator="['oldPassword']" placeholder="请输入原密码" allow-clear />
            </a-form-item>
            <a-form-item label="新密码" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-input
                v-decorator="['newPassword', { rules: [
                  { required: true, validator: validatePass },
                  { pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])\w{6,18}$/, message: '必须有数字和字母并且长度在6~18之间' }
                ]}]"
                placeholder="请输入密码"
                type="password"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="确认密码" style="width: 100%" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-input
                v-decorator="['newPassword1', { rules: [
                  { required: true, validator: validatePass2 }
                ]}]"
                placeholder="请再次输入密码"
                type="password"
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
        </a-tab-pane>
      </a-tabs>
    </basic-container>
  </div>
</template>

<script>
import { getUserInfo, updatePassword, updateUserInfo } from '@/api/common'
import { mapActions } from 'vuex'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      const password = this.passwordForm.getFieldValue('newPassword')
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      type: 'info',
      form: this.$form.createForm(this),
      passwordForm: this.$form.createForm(this),
      /** 验证密码 */
      validatePass,
      validatePass2,
      currentId: ''
    }
  },
  created() {
    this.doSwitch()
  },
  methods: {
    ...mapActions('user', ['logout']),
    onSubmit() {
      if (this.type === 'info') {
        const formData = {
          ...this.form.getFieldsValue(),
          id: this.currentId
        }
        updateUserInfo(formData).then(res => {
          this.$message.success('修改信息成功!')
        })
          .catch(error => { console.log(error) })
      } else {
        updatePassword(this.passwordForm.getFieldValue('oldPassword'), this.passwordForm.getFieldValue('newPassword')).then(res => {
          this.$message.success('修改密码成功!')
          this.doLogout()
        })
          .catch(error => { console.log(error) })
      }
    },
    onCancel() {
      if (this.type === 'info') {
        this.form.resetFields()
      }
      this.passwordForm.resetFields()
    },
    doSwitch() {
      if (this.type === 'info') {
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
      }
    },
    onChange(item) {
      this.type = item
      this.doSwitch()
    },
    doLogout() {
      this.logout()
        .then(() => {
          this.$router.push('/login')
        })
        .catch(err => {
          this.$message.error('注销失败！')
          console.error(err)
        })
    }
  }
}
</script>

<style>
</style>
