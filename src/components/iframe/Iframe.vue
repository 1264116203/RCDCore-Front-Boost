<template>
  <div>
    <iframe v-for="item in iframeTabList"
            v-show="item.key === activeTabKey"
            :key="item.key" :src="item.path" class="iframe"
    ></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AvueIframe',
  computed: {
    activeTabKey: {
      get () {
        return this.$store.state.tabs.activeTabKey
      } },
    ...mapGetters(['screen', 'iframeTabList'])

  },
  watch: {
    $route: function() {
      this.load()
    }
  },
  mounted() {
    this.load()
    this.resize()
  },
  methods: {
    // 加载浏览器窗口变化自适应
    resize() {
      window.onresize = () => {
        this.iframeInit()
      }
    },
    // 加载组件
    load() {
      this.iframeInit()
    },
    // iframe窗口初始化
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight =
        document.documentElement.clientHeight - (screen > 1 ? 200 : 130)
      if (!iframe) return
      iframe.style.height = `${clientHeight}px`
    }
  }
}
</script>

<style lang="less">
.iframe {
  width: 100%;
  height: 800px;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
