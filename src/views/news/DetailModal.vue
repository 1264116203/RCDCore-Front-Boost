<template>
  <a-modal
    v-model="modelVisible"
    title="信息详情"
    :mask-closable="false"
    ok-text="去处理"
    cancel-text="已读"
    @cancel="cancel"
    @ok="doHandleNotice"
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
            <a-avatar slot="avatar" style="backgroundColor:#87d068">
              <a-icon slot="icon" type="mail" />
            </a-avatar>
          </a-list-item-meta>
          {{ item.payload }}
        </a-list-item>
      </a-list>
    </a-spin>
  </a-modal>
</template>

<script>
import { readNotification, getDetailsNotification } from '@/api/notification/notification'
import moment from 'moment'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      // 详情数据
      spinning: false,
      detailsData: [],
      modelVisible: false
    }
  },
  created() {
    this.modelVisible = true
    this.getDetails()
  },
  methods: {
    getDetails() {
      this.detailsData = []
      this.detailsGrantVisible = true
      this.spinning = true
      getDetailsNotification(this.id)
        .then(res => {
          this.detailsData.push(res.data)
          /** 转换为时间格式 */
          this.detailsData.map(item => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
          console.log(this.detailsData)
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.spinning = false
        })
    },
    doHandleNotice() {
      console.log(this.id)
    },
    cancel() {
      this.modelVisible = false
      this.$store.commit('notification/SET_DETAILS_GRANT_VISIBLE', false)
      // 查看详情关闭后标记已读
      readNotification(this.id)
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
