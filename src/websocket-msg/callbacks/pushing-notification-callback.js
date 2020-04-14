import store from '@/store'
import { beforeReceipt } from '@/websocket-msg/event-bus.js'

export default function (obj) {
  store.commit('notification/SET_DETAILS_GRANT_VISIBLE', true)
  store.commit('notification/SET_DETAILS_ID', obj.payload.id)
  store.dispatch('notification/getCount')
  store.dispatch('notification/getDetailsContent')
  let receiptContent = {
    'messageType': 'notification_receipt',
    'contentType': 'json',
    'payload': store.state.notification.detailsId
  }
  beforeReceipt(JSON.stringify(receiptContent))
}
