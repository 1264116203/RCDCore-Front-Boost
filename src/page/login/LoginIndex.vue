<template>
  <div
    class="login-container"
    @keyup.enter.native="handleLogin"
  >
    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <div class="login-time">
          {{ time }}
        </div>
        <img class="img" src="../../assets/login/logo.png">
        <p class="title">
          {{ website.title }}
        </p>
      </div>

      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
            {{ website.title }}用户登录
          </h4>
          <user-login />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { dateFormat } from '@/util/date'
import UserLogin from './Userlogin'
export default {
  name: 'LoginIndex',
  components: { UserLogin },
  props: [],
  data() {
    return {
      time: '',
      activeName: 'user'
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  created() {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  mounted() {},
  methods: {
    getTime() {
      this.time = dateFormat(new Date())
    }
  }
}
</script>

<style lang="less">
@import '../../assets/styles/login.less';
</style>
