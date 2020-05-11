<template>
  <a-modal
    v-model="modalVisible"
    title="信息详情"
    :mask-closable="false"
    @cancel="cancel"
  >
    <a-spin :spinning="spinning">
      <a-list item-layout="vertical" size="large" :data-source="dataList">
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
            <a-avatar slot="avatar" style="background-color:#87d068">
              <a-icon slot="icon" type="mail" />
            </a-avatar>
          </a-list-item-meta>
          {{ item.payload }}
        </a-list-item>
      </a-list>
    </a-spin>

    <template slot="footer">
      <a-button key="submit" type="primary" @click="doHandleNotice">
        {{ handleButtonName }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { readNotification } from '@/api/notification/notification'
import { handle } from '@/websocket-msg/notification-handler-router'
import getHandleButtonName from '@/websocket-msg/handle-button-names'

export default {
  name: 'DetailModal',
  computed: {
    handleButtonName() {
      if (this.notificationDetail && this.notificationDetail.type) {
        return getHandleButtonName(this.notificationDetail.type)
      } else {
        return getHandleButtonName()
      }
    },
    modalVisible: {
      get() {
        return this.$store.state.notification.modalVisible
      },
      set (val) {
        this.$store.commit('notification/SET_MODAL_VISIBLE', val)
      }
    },
    spinning: {
      get() {
        return this.$store.state.notification.modalLoading
      },
      set(val) {
        this.$store.commit('notification/SET_MODAL_LOADING', val)
      }
    },
    notificationDetail() {
      return this.$store.state.notification.content
    },
    dataList() {
      return [this.notificationDetail]
    }
  },
  methods: {
    doHandleNotice() {
      handle(this.notificationDetail)
    },
    async cancel() {
      this.modalVisible = false
      // 查看详情关闭后标记已读
      await readNotification(this.notificationDetail.id)
      await this.$store.dispatch('notification/getCount')
    }
  }
}
</script>
