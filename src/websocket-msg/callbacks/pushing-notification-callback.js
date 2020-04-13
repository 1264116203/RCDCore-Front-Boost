import store from '@/store'
import { beforeReceipt } from '@/websocket-msg/event-bus.js'

export default function (obj) {
  store.commit('notification/SET_DETAILS_GRANT_VISIBLE', true)
  store.commit('notification/SET_DETAILS_ID', obj.payload.id)
  store.dispatch('notification/getCount')
  store.dispatch('notification/getDetailsContent')
  beforeReceipt()
}
