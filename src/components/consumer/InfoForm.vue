<template>
  <div>
    <a-form ref="form" :form="form" class="d1-col-form width64-centered"
            :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
    >
      <a-form-item label="头像">
        <a-upload
          ref="avatarUpload"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          action="/api/upload?subPath=avatar"
          :headers="{ Authorization: 'Bearer ' + token }"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="onChangeAvatar"
        >
          <div style="position: relative;">
            <a-badge v-if="imageUrl" @click.stop="onCancelAvatar">
              <a-icon type="close-circle" theme="filled" style="color: #f5222d" />
            </a-badge>
            <img v-if="imageUrl" :src="imageUrl" class="avatar-img">
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                点击上传
              </div>
            </div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input
          v-decorator="['realName', { rules: [
            { required: true, message: '请输入用户姓名' }
          ]}]"
          placeholder="请输入用户姓名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input
          v-decorator="['name', { rules: [
            { required: true, message: '请输入用户名' }
          ]}]"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input
          v-decorator="['phone', { rules: [
            { pattern:/^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码'}
          ]}]"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input
          v-decorator="['email', { rules: [
            { pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
          ]}]"
          placeholder="请输入电子邮箱"
          type="email"
          allow-clear
        />
      </a-form-item>
      <a-divider />
      <a-form-item class="text-right" :wrapper-col="{ span: 24 }">
        <a-button @click="onCancel">
          清除
        </a-button>
        <a-button type="primary" style="margin-left: 15px" @click="onSubmit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      currentId: '',
      loading: false,
      imageUrl: '',
      avatarFile: null
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      const formData = {
        ...this.form.getFieldsValue(),
        avatar: this.imageUrl,
        id: this.currentId
      }
      updateUserInfo(formData).then(res => {
        this.$message.success('修改信息成功!')
        this.$store.commit('user/SET_USER_INFO', formData)
      })
        .catch(error => { console.log(error) })
    },
    onCancel() {
      this.form.resetFields()
    },
    fetchData() {
      getUserInfo().then(res => {
        const user = res.data
        this.currentId = user.id
        this.form.setFieldsValue({
          name: user.name,
          realName: user.realName,
          phone: user.phone,
          email: user.email
        })
        this.imageUrl = user.avatar
      })
    },
    onChangeAvatar({ file, fileList, event }) {
      if (file.status === 'uploading') {
        this.loading = true
        if (this.avatarFile) {
          this.$refs.avatarUpload.handleManualRemove(this.avatarFile)
          this.avatarFile = null
        }
        return
      }
      if (file.status === 'done') {
        this.imageUrl = file.response.url
        this.loading = false
        this.avatarFile = file
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 200
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
    onCancelAvatar() {
      this.imageUrl = null
      if (this.avatarFile) {
        this.$refs.avatarUpload.handleManualRemove(this.avatarFile)
        this.avatarFile = null
      }
    }
  }
}
</script>

<style>
.avatar-uploader .avatar-img {
  display: block;
  max-width: 128px;
}

.ant-upload .ant-badge {
  position: absolute;
  right: -5px;
  top: -5px;
}

</style>
