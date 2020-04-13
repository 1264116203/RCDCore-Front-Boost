import Vue from 'vue'
import website from '@/config/website'
import store from '@/store'
import WebSocketConnection from '@/websocket-msg'

const bus = new Vue()
Vue.prototype.$wsEventBus = bus

let wsConn = null
const { notificationGatewayHost } = website

export function initConnection () {
  if (wsConn == null) {
    wsConn = new WebSocketConnection({
      url: `ws://${notificationGatewayHost}/websocket/messaging`,
      token: store.getters.token,
      messageHandler: (data) => {
        bus.$emit('messageComes', data)
      }
    })
  }
}

export function beforeDestroy () {
  if (wsConn) {
    wsConn.destroy()
    wsConn = null
  }
}

export function beforeReceipt () {
  if (wsConn) {
    wsConn.receiptMessage()
  }
}

export default bus
