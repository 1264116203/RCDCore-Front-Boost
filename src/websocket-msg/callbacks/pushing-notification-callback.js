import store from '@/store'
import { beforeReceipt } from '@/websocket-msg/event-bus.js'

export default async function (obj) {
  store.commit('notification/SET_MODAL_VISIBLE', true)
  await store.dispatch('notification/getCount')
  await store.dispatch('notification/getDetailsContent', obj.id)
  let receiptContent = {
    'messageType': 'notification_receipt',
    'contentType': 'json',
    'payload': store.state.notification.detailsId
  }
  beforeReceipt(JSON.stringify(receiptContent))
}
