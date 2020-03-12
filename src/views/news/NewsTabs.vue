<template>
  <div class="news-tabs-warp">
    <a-tabs default-active-key="notice" @change="onTabChange">
      <a-tab-pane key="notice">
        <span slot="tab">
          通知
        </span>
        <news-list />
      </a-tab-pane>
      <a-tab-pane key="news">
        <span slot="tab">
          消息
        </span>
        Tab 2
      </a-tab-pane>
      <a-tab-pane key="backlog">
        <span slot="tab">
          待办
        </span>
        Tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import NewsList from './NewsList'
export default {
  name: 'NewsTabs',
  components: { NewsList },
  data() {
    return {
      activeKey: ''
    }
  },
  methods: {
    onTabChange(activeKey) {
      this.activeKey = activeKey
    }
  }

}
</script>

<style scoped lang="less">

</style>
