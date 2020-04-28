<template>
  <a-modal
    v-model="modelVisible"
    title="信息详情"
    :mask-closable="false"
    @cancel="cancel"
  >
    <a-spin :spinning="spinning">
      <a-list item-layout="vertical" size="large" :data-source="detailsContent">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item">
          <template slot="actions">
            <span>
              发送人：{{ item.senderName }}
            </span>
            <span>
              发送时间：{{ item.createTime }}
            </span>
          </template>
          <a-list-item-meta>
            <a slot="title">{{ item.title }}</a>
            <a-avatar slot="avatar" style="backgroundColor:#87d068">
              <a-icon slot="icon" type="mail" />
            </a-avatar>
          </a-list-item-meta>
          {{ item.payload }}
        </a-list-item>
      </a-list>
    </a-spin>

    <template slot="footer">
      <a-button key="submit" type="primary" @click="doHandleNotice">
        去处理
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { readNotification } from '@/api/notification/notification'

export default {
  data: function() {
    return {
      // 详情数据
      spinning: false,
      modelVisible: false
    }
  },
  computed: {
    detailsContent: {
      get() {
        return this.$store.state.notification.detailsContent
      }
    },
    detailsId: {
      get() {
        return this.$store.state.notification.detailsId
      }
    }
  },
  created() {
    this.modelVisible = true
    this.getDetails()
  },
  methods: {
    getDetails() {
      this.detailsGrantVisible = true
      this.spinning = true
      this.$store.dispatch('notification/getDetailsContent')
        .finally(() => {
          this.spinning = false
        })
    },
    doHandleNotice() {
      console.log(this.detailsId)
    },
    cancel() {
      this.modelVisible = false
      this.$store.commit('notification/SET_DETAILS_GRANT_VISIBLE', false)
      // 查看详情关闭后标记已读
      readNotification(this.detailsId)
        .then(() => {
          this.$store.dispatch('notification/getCount')
        })
        .catch(err => console.error(err))
    }
  }
}
</script>

<style>

</style>
