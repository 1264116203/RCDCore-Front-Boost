import Vue from 'vue'
import WebSocketConnection from '@/webSocket/web-socket'

const bus = new Vue()
Vue.prototype.$eventBus = bus

let sconn = null

export function initConnection () {
  if (sconn == null) {
    sconn = new WebSocketConnection({
      url: 'ws://172.25.34.83:8088/websocket/messaging',
      token: 'abc',
      messageHandler: (data) => {
        bus.$emit('getNewsData', data)
      }
    })
  }
}

export function beforeDestory () {
  if (sconn) {
    sconn.destroy()
    sconn = null
  }
}

export default bus
