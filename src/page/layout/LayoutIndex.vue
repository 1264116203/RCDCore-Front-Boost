<template>
  <a-layout>
    <a-layout-sider
      v-model="collapsed"
      breakpoint="lg"
      width="260px"
      :style="{ overflow: 'auto', height: '100vh' }"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
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

export default {
  name: 'LayoutIndex',
  components: { TopLogo, TopBanner, SideMenu, LayoutFooter, Tabs, IframeComponents },
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
    }
  },
  methods: {
    onCollapse(collapsed, type) {
      // console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      // console.log(broken)
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
