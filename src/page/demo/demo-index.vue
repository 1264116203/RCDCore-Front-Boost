<template>
  <a-layout>
    <a-layout-sider
      v-model="collapsed"
      width="260px"
      :style="{ overflow: 'auto', height: '100vh' }"
    >
      <top-logo />
      <a-menu theme="dark" mode="inline">
        <a-menu-item>
          <router-link to="/demo/forms">
            表单示例
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/demo/horizontal-form">
            纵向表单示例
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/news/send-notice">
            消息发送示例
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/demo/printing">
            打印
          </router-link>
        </a-menu-item>
        <a-sub-menu title="子菜单">
          <a-menu-item>子菜单项</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout class="right-side-layout">
      <a-layout-header class="header">
        <top-banner />
      </a-layout-header>

      <a-layout-content style="min-height: auto;">
        <div id="main-content" class="main-content padding-content">
          <keep-alive>
            <router-view class="router-view" />
          </keep-alive>
        </div>
      </a-layout-content>
      <layout-footer v-if="showFooter" />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import TopBanner from '@/page/layout/top-banner/top-banner'
import LayoutFooter from '../layout/layout-footer'
import TopLogo from '@/page/layout/side-menu/top-logo'

export default {
  name: 'DemoIndex',
  components: { TopBanner, LayoutFooter, TopLogo },
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
