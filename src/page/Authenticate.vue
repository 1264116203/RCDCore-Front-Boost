<template>
  <a-spin :tip="tip" size="large">
    <div class="fullscreen"></div>
    <template slot="indicator">
      <a-icon v-if="!gotError" type="loading" style="font-size: 24px" spin />
      <a-icon v-else type="info-circle" style="font-size: 24px" />
    </template>
  </a-spin>
</template>

<script>
import { checkAuthenticate } from '@/api/common'
import { initConnection } from '@/util/eventBus.js'

export default {
  name: 'InitialPage',
  data () {
    return {
      tip: '正在验证用户令牌…',
      gotError: false
    }
  },
  computed: {
    authenticated: {
      get () {
        return this.$store.getters.authenticated
      },
      set (val) {
        this.$store.commit('user/SET_AUTHENTICATED', val)
      }
    },
    lastPageBeforeLogin () {
      return this.$store.state.user.lastPageBeforeLogin
    }
  },
  created () {
    checkAuthenticate()
      .then((response) => {
        const status = response.status
        if (status === 401) {
          this.authenticated = 'no'
          this.$router.push('/login')
        } else {
          this.authenticated = 'yes'
          if (this.lastPageBeforeLogin) {
            // 初始webSocket连接
            initConnection()
            this.$router.push(this.lastPageBeforeLogin)
          } else {
            this.$router.push('/login')
          }
        }
      })
      .catch(() => {
        this.gotError = true
        // this.$notification.error({
        //   description: '鉴定用户身份时发生了未知异常！'
        // })
        this.tip = '鉴定用户身份时发生了未知异常，似乎没能连接至后端服务！'
      })
  }
}
</script>

<style lang="less" scoped>
  .fullscreen {
    width: 100vw;
    height: 100vh;
  }
</style>
