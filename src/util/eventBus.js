import Vue from 'vue'
import WebSocketConnection from '@/webSocket/web-socket'
import website from '@/config/website'
// import store from '@/store'

const bus = new Vue()
Vue.prototype.$eventBus = bus

let sconn = null
const { wsUrl } = website

export function initConnection () {
  if (sconn == null) {
    sconn = new WebSocketConnection({
      url: wsUrl,
      token: 'abc',
      // token: store.getters.token,
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
