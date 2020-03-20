<template>
  <a-spin :tip="tip">
    <div class="fullscreen"></div>
  </a-spin>
</template>

<script>
import { checkAuthenticate } from '@/api/common'
import { initConnection } from '@/util/eventBus.js'

export default {
  name: 'InitialPage',
  data () {
    return {
      tip: '正在验证用户令牌…'
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
        this.$notification.error({
          description: '鉴定用户身份时发生了未知异常！'
        })
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
