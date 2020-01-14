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
  </div>
</template>

<script>
import TabContextmenu from '@/page/layout/tabs/TabContextmenu'
import { mapActions, mapMutations, mapState } from 'vuex'
import { isUrl } from '@/util/validate'

export default {
  name: 'Tabs',
  components: { TabContextmenu },
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
  },
  methods: {
    ...mapMutations('tabs', ['SWITCH_TAB', 'CLOSE_TAB']),
    ...mapActions('tabs', ['navTo']),

    onEdit(targetKey, action) {
      if (action === 'remove') {
        this.closeTab(targetKey)
      }
    },
    navToIframe(iframeElem) {
      this.SWITCH_TAB(iframeElem)
      this.$router.push({
        path: '/myiframe/urlPath',
        params: iframeElem.params,
        query: iframeElem.query,
        meta: iframeElem.meta
      })
    },
    onTabClick(key) {
      const found = this.tabList.find((val) => val.key === key)
      if (found) {
        if (isUrl(found.path)) {
          this.isIframeShow = true
          this.navToIframe(found)
        } else {
          this.isIframeShow = false
          this.navTo(found)
        }
      }
    },
    closeTab(key) {
      const index = this.tabList.findIndex((val) => val.key === key)
      if (index || index === 0) {
        this.CLOSE_TAB(key)
      }
      if (this.tabList.length === 0) {
        this.navTo(null)
        return
      }
      if (key === this.activeTabKey) {
        if (index === 0) {
          this.onTabClick(this.tabList[0].key)
        } else {
          this.onTabClick(this.tabList[index - 1].key)
        }
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
