<template>
  <a-layout>
    <a-layout-sider
      v-model="collapsed"
      width="260px"
      :style="{ overflow: 'auto', height: '100vh' }"
    >
      <top-logo />
      <side-menu />
    </a-layout-sider>

    <a-layout class="right-side-layout">
      <a-layout-header class="header">
        <top-banner />
      </a-layout-header>

      <tabs />

      <a-layout-content style="min-height: auto;">
        <div id="main-content" class="main-content padding-content">
          <div v-show="!isIframeShow">
            <keep-alive>
              <router-view :key="$route.fullPath" class="router-view" />
            </keep-alive>
          </div>
          <iframe-components v-show="isIframeShow" ref="iframeComponentRef" />
        </div>
      </a-layout-content>
      <layout-footer v-if="showFooter" />
    </a-layout>
    <detail-modal />
  </a-layout>
</template>

<script>
import SideMenu from '@/page/layout/side-menu/side-menu'
import LayoutFooter from './layout-footer'
import TopBanner from '@/page/layout/top-banner/top-banner'
import TopLogo from '@/page/layout/side-menu/top-logo'
import Tabs from '@/page/layout/tabs/tabs'
import { mapState } from 'vuex'
import IframeComponents from '@/components/iframe/iframe-component'
import DetailModal from '@/views/news/detail-modal'
import { handle as handleWsMessage } from '@/websocket-msg/callback-router'

export default {
  name: 'LayoutIndex',
  components: { TopLogo, TopBanner, SideMenu, LayoutFooter, Tabs, IframeComponents, DetailModal },
  computed: {
    ...mapState('common', ['showFooter']),
    isIframeShow: {
      get () {
        return this.$store.state.tabs.isIframeShow
      },
      set (val) {
        this.$store.commit('tabs/UPDATE_IS_IFRAME_SHOW', val)
      }
    },
    collapsed: {
      get() {
        return this.$store.getters.isCollapse
      },
      set(val) {
        if (val !== this.collapsed) {
          this.$store.commit('common/TOGGLE_COLLAPSE')
        }
      }
    },
    newsTotal: {
      get() {
        return this.$store.state.notification.newsTotal
      }
    }
  },
  mounted() {
    this.$wsEventBus.$on('messageComes', this.onWsMessageComes)
  },
  created () {
    const that = this
    function fetchNotificationCount() {
      that.$store.dispatch('notification/getCount').then(() => {
        if (!window.notificationCountTimer) {
          window.notificationCountTimer = setTimeout(fetchNotificationCount, 30 * 1000)
        }
      })
    }

    fetchNotificationCount()
  },
  destroyed() {
    this.$wsEventBus.$off('messageComes', this.onWsMessageComes)
  },
  methods: {
    onWsMessageComes(data) {
      try {
        let obj = JSON.parse(data)
        handleWsMessage(obj)
      } catch (e) {
        this.$notification.error({
          message: '处理收到的WS消息时发生了异常！'
        })
        console.error(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../custom-variables";
  .header {
    background: #fff;
    padding: 0;
  }
  .right-side-layout {
    height: 100vh;
  }
  .padding-content {
    margin: 0;
    background-color: @body-background;
    overflow: auto
  }
  .main-content {
    height: 100%;
  }
</style>
