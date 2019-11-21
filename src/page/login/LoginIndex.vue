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
        <img
          class="img"
          src="../../assets/login/logo.png"
          alt=""
        >
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
          <!--<div class="login-menu">-->
          <!--  <a-->
          <!--    href="#"-->
          <!--    @click.stop="activeName='user'"-->
          <!--  >用户名</a>-->
          <!--  <a-->
          <!--    href="#"-->
          <!--    @click.stop="activeName='code'"-->
          <!--  >手机</a>-->
          <!--  <a-->
          <!--    href="#"-->
          <!--    @click.stop="activeName='third'"-->
          <!--  >第三方</a>-->
          <!--</div>-->
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
  // watch: {
  //   $route() {
  //     const params = this.$route.query
  //     this.socialForm.state = params.state
  //     this.socialForm.code = params.code
  //     if (!validateNull(this.socialForm.state)) {
  //       const loading = this.$loading({
  //         lock: true,
  //         text: `${
  //           this.socialForm.state === 'WX' ? '微信' : 'QQ'
  //         }登录中,请稍后。。。`,
  //         spinner: 'el-icon-loading'
  //       })
  //       setTimeout(() => {
  //         loading.close()
  //       }, 2000)
  //     }
  //   }
  // },
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
