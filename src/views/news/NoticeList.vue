<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.time+'年前'"
        >
          <a slot="title" href="https://www.antdv.com/">{{ item.content }}</a>
          <a-avatar slot="avatar">
            <a-icon :type="item.icon" />
          </a-avatar>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-spin>
</template>
<script>
import { listCurrentUsersNotification } from '@/api/notification/notification'

export default {
  data() {
    return {
      data: [],
      isLoading: false
    }
  },
  created () {
    this.fetchNotificationData()
  },
  methods: {
    /** 列表数据 */
    fetchNotificationData () {
      this.isLoading = true
      listCurrentUsersNotification()
        .then(res => {
          // this.data = res.data
          console.log(res)
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
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
