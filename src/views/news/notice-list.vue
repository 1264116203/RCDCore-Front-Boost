<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" @click="getDetails(item)">详情</a>
        <a-list-item-meta
          :description="item.summary"
        >
          <a slot="title">{{ item.title }}<a-tag v-if="!item.read" color="red">未读</a-tag></a>
          <a-avatar slot="avatar" style="backgroundColor:#87d068">
            <a-icon slot="icon" type="mail" />
          </a-avatar>
        </a-list-item-meta>
        {{ item.createTime }}
      </a-list-item>
    </a-list>
  </a-spin>
</template>
<script>
import { listWithPagination } from '@/api/notification/notification'
import moment from 'moment'

export default {
  data() {
    return {
      data: [],
      isLoading: false,
      // 分页
      page: 0,
      size: 10
    }
  },
  computed: {
    detailsGrantVisible: {
      get() {
        return this.$store.state.notification.detailsGrantVisible
      }
    },
    showNewsDropdown: {
      get() {
        return this.$store.state.notification.showNewsDropdown
      },
      set (val) {
        this.$store.commit('notification/SET_NEWS_DROPDOWN', val)
      }
    },
    detailsId: {
      get() {
        return this.$store.state.notification.detailsId
      }
    },
    detailsContent: {
      get() {
        return this.$store.state.notification.detailsContent
      }
    }
  },
  watch: {
    showNewsDropdown: function (val) {
      if (val) {
        this.fetchNotificationData()
      }
    }
  },
  created () {
    this.fetchNotificationData()
  },
  methods: {
    /** 列表数据 */
    fetchNotificationData () {
      this.isLoading = true
      listWithPagination(this.page, this.size, { sort: ['read', 'createTime,desc'] })
        .then(res => {
          this.data = res.data.content
          /** 转换为时间格式 */
          this.data.map(item => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    getDetails(item) {
      this.$store.commit('notification/SET_NEWS_DROPDOWN', false)
      this.$store.commit('notification/SET_DETAILS_GRANT_VISIBLE', true)
      this.$store.commit('notification/SET_DETAILS_ID', item.id)
    }
  }
}
</script>
<style lang="less">
.news-list{
  .ant-list-split{
    max-height: 260px;
    overflow-y: scroll;
    .ant-list-item{
    padding: 12px;
    }
  }
}
</style>
