<template>
  <div class="no-border-margin-tabs" @contextmenu.prevent.stop="showTabContextmenu">
    <a-tabs v-model="activeTabKey" hide-add
            @tabClick="onTabClick" @edit="onEdit"
    >
      <a-tab-pane v-for="tabElem in tabList"
                  :key="tabElem.key"
                  :tab="tabElem.label"
                  :closeable="tabElem.closeable"
      />
    </a-tabs>
    <tab-contextmenu />
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
    ...mapState('tabs', ['contextmenuShowing', 'tabList', 'homepageTab']),
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
    ...mapMutations('tabs', ['UPDATE_CONTEXTMENU_SHOWING',
      'UPDATE_CONTEXTMENU_POSITION', 'ADD_TAB', 'CLOSE_TAB']),
    ...mapActions('tabs', ['navTo']),

    showTabContextmenu(event) {
      event.preventDefault()
      event.stopPropagation()

      this.UPDATE_CONTEXTMENU_SHOWING(true)
      this.UPDATE_CONTEXTMENU_POSITION({ x: event.clientX, y: event.clientY })
    },
    onEdit(targetKey, action) {
      if (action === 'remove') {
        this.closeTab(targetKey)
      }
    },
    navToIframe(iframeElem) {
      this.isIframeShow = true
      const iframeComponentRef = this.$refs.iframeComponentRef

      iframeComponentRef.open({
        key: iframeElem.key,
        url: iframeElem.url
      })

      if (!this.tabList.find((val) => val.key === iframeElem.key)) {
        const tabArr = this.tabList
        tabArr.push(iframeElem)
        this.tabList = tabArr
      }
      this.activeTabKey = iframeElem.key
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
        const tabArr = this.tabList

        const item = tabArr[index]
        if (isUrl(item.path)) {
          this.$refs.iframeComponentRef.close(key)
        }
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

  .no-border-margin-tabs .ant-tabs-bar {
    border-top: 1px solid #e8e8e8;
    margin: 0;
    padding: 0 1rem;
    background-color: @body-background;
  }
</style>
