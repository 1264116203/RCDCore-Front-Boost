<template>
  <div>
    <a-form ref="form" :form="form" class="d2-col-form"
            :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
    >
      <a-form-item label="头像" style="width: 60%" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
        <a-upload
          v-decorator="['avatar']"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :headers="{
            Authorization: 'Bearer ' + token
          }"
          :show-upload-list="false"
          action="/api/upload?subPath=avatar"
          :before-upload="beforeUpload"
          @change="onChangeAvatar"
        >
          <a-badge v-if="imageUrl" @click.stop="onCancelAvatar">
            <a-icon type="close" style="color: #f5222d" />
          </a-badge>
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="avatar-img">
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              点击上传
            </div>
          </div>
        </a-upload>
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
import { mapGetters } from 'vuex'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      currentId: '',
      loading: false,
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.doSwitch()
  },
  methods: {
    onSubmit() {
      const formData = {
        ...this.form.getFieldsValue(),
        avatar: this.form.getFieldValue('avatar').fileList[0].response.url,
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
    },
    onChangeAvatar(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
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
      this.imageUrl = ''
    }
  }
}
</script>

<style>
.avatar-uploader .avatar-img{
    width: 128px;
    height: 128px;
  }

.ant-upload .ant-badge{
    position: absolute;
    left: 138px;
    top: 138px;
  }

</style>
