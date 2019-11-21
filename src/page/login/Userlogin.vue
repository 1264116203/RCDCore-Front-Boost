<template>
  <a-spin :spinning="spinning">
    <a-form
      ref="loginForm"
      :rules="loginRules"
      :model="loginForm"
      class="login-form"
      status-icon
      label-width="0"
    >
      <a-form-item prop="username">
        <a-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          size="small"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="icon-yonghu"></i>
        </a-input>
      </a-form-item>
      <a-form-item prop="password">
        <a-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          size="small"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        >
          <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword"></i>
          <i slot="prefix" class="icon-mima"></i>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" class="login-submit" @click.native.prevent="handleLogin">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import { mapGetters } from 'vuex'
import website from '@/config/website'

export default {
  name: 'UserLogin',
  props: [],
  data() {
    return {
      spinning: false,
      tenantMode: website.tenantMode,
      loginForm: {
        tenantId: '000000',
        username: 'superadmin',
        password: 'admin',
        type: 'account'
      },
      loginRules: {
        tenantId: [
          { required: false, message: '请输入租户ID', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  computed: {
    ...mapGetters(['dashboardTab'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.spinning = true
      this.$store.dispatch('user/loginByUsername', this.loginForm)
        .then(() => {
          this.$router.push({ path: this.dashboardTab.value })
        })
        .finally(() => {
          this.spinning = false
        })
    }
  }
}
</script>

<style>
</style>
