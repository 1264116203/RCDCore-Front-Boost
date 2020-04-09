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
    <detail-modal v-if="detailsGrantVisible" />
  </a-layout>
</template>

<script>
import SideMenu from '@/page/layout/side-menu/SideMenu'
import LayoutFooter from './Footer'
import TopBanner from '@/page/layout/top-banner/TopBanner'
import TopLogo from '@/page/layout/side-menu/TopLogo'
import Tabs from '@/page/layout/tabs/Tabs'
import { mapState } from 'vuex'
import IframeComponents from '@/components/iframe/Iframe'
import DetailModal from '@/views/news/DetailModal.vue'

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
    },
    detailsGrantVisible: {
      get() {
        return this.$store.state.notification.detailsGrantVisible
      }
    }
  },
  mounted() {
    this.$eventBus.$on('getNewsData', this.onNewsData)
  },
  created () {
    setInterval(() => {
      this.$store.dispatch('notification/getCount')
    }, 30000)
  },
  methods: {
    onNewsData(data) {
      let obj = JSON.parse(data)
      if (obj.messageType === 'pushing_notification') {
        this.$store.commit('notification/SET_DETAILS_GRANT_VISIBLE', true)
        this.$store.dispatch('notification/getCount')
        this.$store.commit('notification/SET_DETAILS_ID', obj.payload.id)
        this.$store.dispatch('notification/getDetailsContent')
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
