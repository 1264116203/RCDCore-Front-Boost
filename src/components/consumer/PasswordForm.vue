<template>
  <div>
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
  </div>
</template>

<script>
import { updatePassword } from '@/api/common'
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
      passwordForm: this.$form.createForm(this),
      /** 验证密码 */
      validatePass,
      validatePass2
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    onSubmit() {
      updatePassword(this.passwordForm.getFieldValue('oldPassword'), this.passwordForm.getFieldValue('newPassword')).then(res => {
        this.$message.success('修改密码成功!')
        this.doLogout()
      })
        .catch(error => { console.log(error) })
    },
    onCancel() {
      this.passwordForm.resetFields()
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
