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

      <a-layout-content>
        <div id="main-content" class="padding-content">
          <router-view />
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
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  components: { TopLogo, TopBanner, SideMenu, LayoutFooter },
  computed: {
    ...mapState('common', ['showFooter']),
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
      console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      console.log(broken)
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
    margin: 24px 16px 0;
    background-color: @body-background;
    overflow: auto
  }
</style>
