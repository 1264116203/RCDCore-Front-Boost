import { mapActions, mapMutations } from 'vuex'
import { isUrl } from '@/util/validate'
export const homePageMixin = {
  computed: {
    isIframeShow: {
      get () {
        return this.$store.state.tabs.isIframeShow
      },
      set (val) {
        this.$store.commit('tabs/UPDATE_IS_IFRAME_SHOW', val)
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
