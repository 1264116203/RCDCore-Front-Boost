import Vue from 'vue'
import WebSocketConnection from '@/webSocket/web-socket'
import website from '@/config/website'
import store from '@/store'

const bus = new Vue()
Vue.prototype.$eventBus = bus

let wsConn = null
const { notificationGatewayHost } = website

export function initConnection () {
  if (wsConn == null) {
    wsConn = new WebSocketConnection({
      url: `ws://${notificationGatewayHost}/websocket/messaging`,
      token: store.getters.token,
      messageHandler: (data) => {
        bus.$emit('getNewsData', data)
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

export default bus
