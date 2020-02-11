import { mapActions, mapMutations, mapState } from 'vuex'
import { isUrl } from '@/util/validate'

/**
 * 标签页混入模块
 */
export const TabPanelMixin = {
  computed: {
    ...mapState('tabs', ['tabList'])
  },
  methods: {
    ...mapMutations('tabs', ['SWITCH_TAB', 'CLOSE_TAB', 'CLOSE_OTHER', 'CLOSE_ALL', 'UPDATE_IS_IFRAME_SHOW']),
    ...mapActions('tabs', ['navTo']),

    onEdit(targetKey, action) {
      if (action === 'remove') {
        this.closeTab(targetKey)
      }
    },
    navToIframe(iframeElem) {
      this.navTo({
        ...iframeElem,
        path: '/myiframe/urlPath'
      })
    },
    onTabClick(key) {
      const found = this.tabList.find((val) => val.key === key)
      if (found) {
        if (isUrl(found.path)) {
          this.navToIframe(found)
        } else {
          this.navTo(found)
          this.UPDATE_IS_IFRAME_SHOW(false)
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
    },
    closeAllTabs() {
      this.CLOSE_ALL()
      this.navTo(null)
    },
    closeOtherTabs() {
      this.CLOSE_OTHER(this.rightTabKey)
      this.onTabClick(this.rightTabKey)
    }
  }
}
