<template>
  <div class="top-banner">
    <div class="top-banner-left">
      <span>
        <a-icon v-if="showCollapse"
                class="collapseButton"
                :type="isCollapse ? 'menu-unfold' : 'menu-fold'"
                @click="toggleCollapsed"
        />
      </span>
      <!-- <div class="quick-action">
        <a-dropdown>
          <span class="pointer"> <a-icon type="block" /> 快捷操作</span>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>-->
    </div>
    <div class="top-banner-right">
      <!--
      <div>
        <a-tooltip placement="bottom" title="锁屏">
          <a-button type="link" class="right-button">
            <a-icon type="lock" theme="filled" />
          </a-button>
        </a-tooltip>
      </div>
      -->
      <div>
        <a-tooltip placement="bottom" title="全屏切换">
          <a-button type="link" class="right-button" @click="toggleFullScreenClicked">
            <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" />
          </a-button>
        </a-tooltip>
      </div>

      <div class="pointer avatar-dropdown">
        <a-dropdown>
          <div style="display:inline-block; height: 3rem;">
            <a-avatar icon="user" style="margin-right: 0.5rem;" :size="32" />
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="doBackHome">
              首页
            </a-menu-item>
            <a-menu-item @click="doUserInfo">
              个人信息
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="doLogout">
              退出登录
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { fullscreenListener, toggleFullscreen } from '@/util/util'

export default {
  name: 'TopBanner',
  computed: {
    ...mapState('common', ['isCollapse', 'showCollapse']),
    ...mapGetters(['isFullScreen'])
  },
  mounted() {
    fullscreenListener(() => {
      this.TOGGLE_FULLSCREEN()
    })
  },
  methods: {
    ...mapMutations('common', ['TOGGLE_COLLAPSE', 'TOGGLE_FULLSCREEN']),
    ...mapActions('user', ['logout']),
    ...mapActions('tabs', ['navTo']),
    toggleCollapsed() {
      this.TOGGLE_COLLAPSE()
    },
    toggleFullScreenClicked () {
      toggleFullscreen()
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
    },
    doBackHome() {
      this.navTo({
        path: '/main/home',
        meta: {
          isAuth: true,
          isTab: true
        }
      })
    },
    doUserInfo() {
      this.navTo({
        path: '/user/info',
        meta: {
          isAuth: true,
          isTab: true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../custom-variables";

  .pointer {
    cursor: pointer;
  }

  .top-banner {
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;

    .top-banner-left {
      display: inline-flex;
      justify-items: center;

      .collapseButton {
        margin-left: 1rem;
        font-size: 1.2rem;
      }

      .quick-action {
        margin-left: 2em;
        margin-top: -0.125rem;
      }
    }

    .top-banner-right {
      display: inline-flex;
      justify-items: center;

      .right-button {
        font-size: 18px;
        color: @text-color;
        padding: 0 0.5rem;
      }

      .avatar-dropdown {
        margin-left: 0.5rem;
        margin-top: -0.125rem;
      }
    }
  }
</style>
