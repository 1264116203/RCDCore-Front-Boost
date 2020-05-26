import store from '@/store'
import { beforeReceipt } from '@/websocket-msg/event-bus.js'

export default async function (obj) {
  store.commit('notification/SET_MODAL_VISIBLE', true)
  await store.dispatch('notification/getCount')
  await store.dispatch('notification/getDetailsContent', obj.payload.id)
  let receiptContent = {
    'messageType': 'notification_receipt',
    'contentType': 'json',
    'payload': obj.payload.id
  }
  beforeReceipt(JSON.stringify(receiptContent))
}
