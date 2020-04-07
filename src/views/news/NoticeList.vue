<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" @click="getDetails(item)">详情</a>
        <a-badge :dot="!item.read" />
        <a-list-item-meta
          :description="item.summary"
        >
          <a slot="title">{{ item.title }}</a>
          <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </a-list-item-meta>
        {{ item.createTime }}
      </a-list-item>
    </a-list>
    <a-modal
      v-model="detailsGrantVisible"
      title="信息详情"
      :mask-closable="false"
      :footer="null"
      @cancel="cancel"
    >
      <a-spin :spinning="spinning">
        <a-list item-layout="vertical" size="large" :data-source="detailsData">
          <a-list-item slot="renderItem" key="item.title" slot-scope="item">
            <template slot="actions">
              <span>
                发送人：{{ item.senderName }}
              </span>
              <span>
                发送时间：{{ item.createTime }}
              </span>
            </template>
            <a-list-item-meta :description="item.summary">
              <a slot="title">{{ item.title }}</a>
              <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </a-list-item-meta>
            {{ item.payload }}
          </a-list-item>
        </a-list>
      </a-spin>
    </a-modal>
  </a-spin>
</template>
<script>
import { listWithPagination, readNotification } from '@/api/notification/notification'

export default {
  data() {
    return {
      data: [],
      isLoading: false,
      // 分页
      page: 0,
      size: 3,
      // 详情数据
      spinning: false,
      detailsData: [],
      detailsGrantVisible: false,
      id: ''
    }
  },
  created () {
    this.fetchNotificationData()
  },
  methods: {
    /** 列表数据 */
    fetchNotificationData () {
      this.isLoading = true
      listWithPagination(this.page, this.size)
        .then(res => {
          this.data = res.data.content
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    getDetails(item) {
      this.detailsGrantVisible = true
      this.spinning = true
      this.id = item.id
      listWithPagination(0, 1, { title: item.title })
        .then(res => {
          this.detailsData = res.data.content
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.spinning = false
        })
    },
    cancel() {
      this.detailsGrantVisible = false
      // 查看详情关闭后标记已读
      readNotification(this.id)
        .catch(err => console.error(err))
        .finally(() => {
          this.$message.success('消息已读!')
        })
    }
  }
}
</script>
<style lang="less">
.news-list{
  .ant-list-item{
  padding: 12px;
  }
}
</style>
