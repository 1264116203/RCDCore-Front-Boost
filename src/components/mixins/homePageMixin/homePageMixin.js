import { mapActions, mapMutations } from 'vuex'
import { isUrl } from '@/util/validate'
export const homePageMixin = {
  methods: {
    ...mapMutations('tabs', ['SWITCH_TAB', 'CLOSE_TAB']),
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
