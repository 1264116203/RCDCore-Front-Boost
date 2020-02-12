<template>
  <div>
    <basic-container>
      <a-tabs default-active-key="info" @change="onChange">
        <a-tab-pane key="info" tab="个人信息">
          <a-form ref="form" :form="form" class="d2-col-form"
                  :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @submit="onSubmit"
          >
            <a-form-item label="姓名" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input v-model="form.name" allow-clear />
            </a-form-item>
            <a-form-item label="用户名" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input v-model="form.realName" allow-clear />
            </a-form-item>
            <a-form-item label="手机号" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input v-model="form.phone" allow-clear />
            </a-form-item>
            <a-form-item label="邮箱" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input v-model="form.email" allow-clear />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 24, offset: 24 }">
              <a-button type="primary" html-type="submit">
                提交
              </a-button>
              <a-button>
                清除
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="password" tab="修改密码">
          <a-form ref="form" :form="passwordForm" class="d2-col-form"
                  :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="原密码" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input placeholder="请输入原密码" allow-clear />
            </a-form-item>
            <a-form-item label="新密码" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input placeholder="请输入新密码" allow-clear />
            </a-form-item>
            <a-form-item label="确认密码" style="width: 100%" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-input placeholder="请输入确认密码" allow-clear />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </basic-container>
  </div>
</template>

<script>
import update from '@/api/system/user-management'
import { getUserInfo, updatePassword } from '@/api/common'

export default {
  data() {
    return {
      type: 'info',
      form: {},
      passwordForm: {}
    }
  },
  created() {
    this.handleWitch()
  },
  methods: {
    onSubmit() {
      console.log(this.type === 'info')
      if (this.type === 'info') {
        update(this.form).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改信息成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      } else {
        updatePassword(this.form.oldPassword, this.form.newPassword, this.form.newPassword1).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改密码成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      }
    },
    handleWitch() {
      if (this.type === 'info') {
        getUserInfo().then(res => {
          const user = res.data
          this.form = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            phone: user.phone,
            email: user.email
          }
        })
      }
    },
    onChange(item) {
      this.type = item
      this.handleWitch()
    }
  }
}
</script>

<style>
</style>
