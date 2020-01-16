<template>
  <div class="no-border-margin-tabs">
    <a-tabs v-model="activeTabKey" type="editable-card" :hide-add="true"
            @tabClick="onTabClick" @edit="onEdit"
    >
      <a-tab-pane v-for="tabElem in tabList"
                  :key="tabElem.key"
                  :closable="tabElem.closeable"
      >
        <span slot="tab" v-contextmenu:contextmenu class="tab-slot">
          {{ tabElem.label }}
        </span>
      </a-tab-pane>
    </a-tabs>
    <v-contextmenu ref="contextmenu">
      <tab-contextmenu />
    </v-contextmenu>
    <div v-show="!isIframeShow">
      <keep-alive>
        <router-view class="router-view" />
      </keep-alive>
    </div>
    <div v-show="isIframeShow">
      <iframe-components ref="iframeComponentRef" />
    </div>
  </div>
</template>

<script>
import TabContextmenu from '@/page/layout/tabs/TabContextmenu'
import iframeComponents from '@/components/iframe/Iframe'
import { mapState } from 'vuex'
import { homePageMixin } from '@/components/mixins/homePageMixin/homePageMixin'

export default {
  name: 'Tabs',
  components: { TabContextmenu, iframeComponents },
  mixins: [homePageMixin],
  data() {
    return {
      isIframeShow: false
    }
  },
  computed: {
    ...mapState('tabs', ['tabList', 'homepageTab']),
    activeTabKey: {
      get () {
        return this.$store.state.tabs.activeTabKey
      },
      set(val) {
        this.$store.commit('tabs/UPDATE_ACTIVE_TAB_KEY', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
  @import "../../../custom-variables";

  .no-border-margin-tabs {
    padding-top: 1px;
    background-color: @body-background;
    border-top: 1px solid #e8e8e8;
    .ant-tabs-bar {
      margin: 0;
      padding: 0 1rem;

      .ant-tabs-nav {
        .ant-tabs-tab {
          padding: 0 16px 0 0;
          .tab-slot {
            padding: 0 0 0 16px;
            user-select: none;
          }
        }
      }
    }
  }
</style>
