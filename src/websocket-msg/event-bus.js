import Vue from 'vue'
import website from '@/config/website'
import WebSocketConnection from '@/websocket-msg'

const bus = new Vue()
Vue.prototype.$wsEventBus = bus

let wsConn = null
const { notificationGatewayHost } = website

export function initConnection () {
  if (wsConn == null) {
    wsConn = new WebSocketConnection({
      url: `ws://${notificationGatewayHost}/websocket/messaging`,
      messageHandler: (data) => {
        bus.$emit('messageComes', data)
      }
    })
  }
}

export function beforeDestroy () {
  debugger
  if (wsConn) {
    wsConn.destroy()
    wsConn = null
  }
  if (window.notificationCountTimer) {
    clearTimeout(window.notificationCountTimer)
  }
}

export function beforeReceipt (obj) {
  if (wsConn) {
    wsConn.receiptMessage(obj)
  }
}

export default bus
