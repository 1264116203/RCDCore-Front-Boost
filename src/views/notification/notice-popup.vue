<template>
  <div class="news-tabs-warp">
    <a-tabs :default-active-key="activeKey" @change="onTabChange">
      <a-tab-pane key="notice">
        <span slot="tab">
          通知
        </span>
      </a-tab-pane>
      <a-tab-pane key="message">
        <span slot="tab">
          消息
        </span>
      </a-tab-pane>
      <a-tab-pane key="all">
        <span slot="tab">
          所有
        </span>
      </a-tab-pane>
    </a-tabs>
    <notice-list :type="type" />
    <div class="news-list-footer">
      <div class="news-list-btn" @click="moreNotifications">
        查看更多
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NoticeList from './notice-list'

export default {
  name: 'NoticePopup',
  components: { NoticeList },
  data() {
    return {
      activeKey: 'all',
      type: ''
    }
  },
  computed: {
    dropdownVisible: {
      get () {
        return this.$store.state.notification.dropdownVisible
      },
      set (val) {
        this.$store.commit('notification/SET_DROPDOWN_VISIBLE', val)
      }
    }
  },
  methods: {
    ...mapActions('tabs', ['navTo']),
    onTabChange(activeKey) {
      this.activeKey = activeKey

      if (this.activeKey === 'all') {
        this.type = ''
      } else {
        this.type = this.activeKey
      }
    },
    moreNotifications() {
      this.dropdownVisible = true
      this.navTo({
        path: '/news/notice'
      })
    },
    closeTab() {
      this.dropdownVisible = false
    }
  }

}
</script>

<style lang="less">
  .news-tabs-warp {
    .ant-tabs-bar {
      margin: 0;
    }
  }

  .news-list-footer {
    border-top: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    line-height: 45px;
    border-radius: 4px;

    .news-list-btn {
      flex: 1;
      text-align: center;
      cursor: pointer;
    }

    .news-list-btn-border {
      border-right: 1px solid #e8e8e8
    }
  }
</style>
