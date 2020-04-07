<template>
  <div class="news-warp">
    <h3>通知</h3>
    <a-divider />
    <a-card
      style="width:100%"
      :bordered="false"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <p v-if="noTitleKey=== 'all'">
        <a-spin :spinning="isLoading">
          <a-list item-layout="vertical" size="large" :data-source="data">
            <a-list-item slot="renderItem" key="item.title" slot-scope="item">
              <template slot="actions">
                <span>
                  发送人：{{ item.senderName }}
                </span>
                <span>
                  发送时间：{{ item.createTime }}
                </span>
              </template>
              <div slot="extra">
                <a-button type="primary" style="margin-right: 20px" :disabled="item.read" @click="doRead(item.id)">
                  已读
                </a-button>
                <a-button>去处理</a-button>
              </div>
              <a-badge :dot="!item.read" />
              <a-list-item-meta :description="item.summary">
                <a slot="title">{{ item.title }}</a>
                <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </a-list-item-meta>
              {{ item.payload }}
            </a-list-item>
          </a-list>
        </a-spin>
      </p>
      <p v-else-if="noTitleKey === 'alreadyRead'">
        article content
      </p>
      <p v-else-if="noTitleKey === 'unread'">
        app content
      </p>
      <p v-else-if="noTitleKey === 'send'">
        <send />
      </p>
    </a-card>
  </div>
</template>

<script>
import { listCurrentUsersNotification, readNotification } from '@/api/notification/notification'
import send from './send'

export default {
  components: { send },
  data() {
    return {
      tabListNoTitle: [
        {
          key: 'all',
          tab: '全部数据'
        },
        {
          key: 'alreadyRead',
          tab: '已读'
        },
        {
          key: 'unread',
          tab: '未读'
        },
        {
          key: 'send',
          tab: '发送'
        }
      ],
      noTitleKey: 'all',
      data: [],
      isLoading: false
    }
  },
  created () {
    this.fetchListData()
  },
  methods: {
    /** 列表数据 */
    fetchListData () {
      this.isLoading = true
      listCurrentUsersNotification()
        .then(res => {
          this.data = res.data
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    onTabChange(key, type) {
      this[type] = key
    },
    doRead(id) {
      readNotification(id)
        .catch(err => console.error(err))
        .finally(() => {
          this.$message.success('消息已读!')
        })
    }
  }
}
</script>

<style scoped lang="less">
.news-warp{
    padding: 24px 32px;
}
</style>
