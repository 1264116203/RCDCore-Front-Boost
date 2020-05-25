<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <template #description>
            <div style="width: 600px;word-wrap:break-word;">
              {{ item.summary }}
            </div>
          </template>
          <a slot="title">{{ item.title }}
            <a-tag v-if="!item.read" color="red">未读</a-tag>
          </a>
          <a-avatar slot="avatar" style="background-color:#87d068">
            <a-icon slot="icon" type="mail" />
          </a-avatar>
        </a-list-item-meta>
        {{ item.createTime }}
        <a slot="actions" @click="openDetailModel(item)">详情</a>
      </a-list-item>
    </a-list>
  </a-spin>
</template>
<script>
import { listWithPagination } from '@/api/notification/notification'
import moment from 'moment'

export default {
  name: 'NoticeList',
  props: {
    type: {
      type: String,
      default: () => ''
    }
  },
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
        return this.$store.state.notification.modalVisible
      }
    },
    dropdownVisible: {
      get() {
        return this.$store.state.notification.dropdownVisible
      },
      set(val) {
        this.$store.commit('notification/SET_DROPDOWN_VISIBLE', val)
      }
    },
    detailsContent() {
      return this.$store.state.notification.content
    }
  },
  watch: {
    dropdownVisible: function (val) {
      if (val) {
        this.fetchNotificationData()
      }
    },
    type: function (val) {
      this.fetchNotificationData()
    }
  },
  created() {
    this.fetchNotificationData()
  },
  methods: {
    /** 列表数据 */
    fetchNotificationData() {
      this.isLoading = true
      listWithPagination(this.page, this.size, { sort: ['read', 'createTime,desc'], type: this.type })
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
    async openDetailModel(item) {
      await this.$store.dispatch('notification/getDetailsContent', item.id)
      this.$store.commit('notification/SET_DROPDOWN_VISIBLE', false)
      this.$store.commit('notification/SET_MODAL_VISIBLE', true)
    }
  }
}
</script>
<style lang="less">
  .news-list {
    .ant-list-split {
      max-height: 260px;
      overflow-y: scroll;

      .ant-list-item {
        padding: 12px;
      }
    }
  }
</style>
