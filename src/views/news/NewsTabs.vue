<template>
  <div class="news-tabs-warp">
    <a-tabs default-active-key="notice" @change="onTabChange">
      <a-tab-pane key="notice">
        <span slot="tab">
          通知
        </span>
        <notice-list />
      </a-tab-pane>
      <a-tab-pane key="news">
        <span slot="tab">
          消息
        </span>
        <news-list />
      </a-tab-pane>
      <a-tab-pane key="backlog">
        <span slot="tab">
          待办
        </span>
        <backlog-list />
      </a-tab-pane>
    </a-tabs>
    <div class="news-list-footer">
      <div class="news-list-btn news-list-btn-border">
        清空 {{ title[activeKey] }}
      </div>
      <div class="news-list-btn" @click="goMorelist">
        查看更多
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NewsList from './NewsList'
import NoticeList from './NoticeList'
import BacklogList from './BacklogList'
export default {
  name: 'NewsTabs',
  components: { NewsList, NoticeList, BacklogList },
  data() {
    return {
      activeKey: 'notice',
      title: {
        'notice': '通知',
        'news': '消息',
        'backlog': '待办'
      }
    }
  },
  methods: {
    ...mapActions('tabs', ['navTo']),
    onTabChange(activeKey) {
      this.activeKey = activeKey
    },
    goMorelist() {
      this.navTo({
        path: '/news/notice'
      })
    }
  }

}
</script>

<style lang="less">
.news-tabs-warp{
  .ant-tabs-bar{
   margin: 0px;
  }
}

.news-list-footer{
    border-top: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    line-height: 45px;
    border-radius: 4px;
    .news-list-btn{
        flex: 1;
        text-align: center;
        cursor: pointer;
    }
    .news-list-btn-border{
        border-right: 1px solid #e8e8e8
    }
}
</style>
