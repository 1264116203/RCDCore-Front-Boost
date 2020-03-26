import store from '@/store'
export default class WebSocketConnection {
  websocketInstance = null

  url = null
  token = null

  lockReconnect = false

  reconnectTimerId = null

  heartBeatDuration = 5000
  heartBeatTimerId = null

  messageHandler = function (data) {
  }

  constructor(option) {
    this.url = option.url
    this.token = option.token

    this.messageHandler = option.messageHandler

    this.establishConnection()
  }

  establishConnection() {
    try {
      const wsurl = `${this.url}?token=${this.token}`
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '正在连接消息服务...')
      this.websocketInstance = new WebSocket(wsurl)
    } catch (e) {
      this.reconnect()
    }

    this.websocketInstance.onopen = (event) => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', true)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务建立连接成功!')
      this.heartBeatTimerId = window.setInterval(() => this.heartBeat(), this.heartBeatDuration)
      // heartCheck.start(webSocket) // 心跳
    }

    this.websocketInstance.onmessage = (event) => {
      // if (event.data === 'HeartBeat') {
      //   console.log('收到了心跳检测')
      //   heartCheck.start(this.websocketInstance) // 心跳
      // } else {
      //   const data = event.data
      //   console.log(data)
      // }
      const data = event.data
      if (this.messageHandler) {
        this.messageHandler(data)
      }
    }

    this.websocketInstance.onerror = () => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '发生异常了')
      this.reconnect() // 重连
    }
    this.websocketInstance.onclose = (event) => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务连接断开，正在重连')
      this.reconnect() // 重连
    }
  }

  /** websocket重连 */
  reconnect() {
    if (this.lockReconnect) {
      return
    }
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    this.reconnectTimerId && clearTimeout(this.reconnectTimerId)

    this.reconnectTimerId = setTimeout(() => {
      this.establishConnection()
      this.lockReconnect = false
    }, 4000)
  }

  /** 销毁WebSocket */
  destroy() {
    if (this.heartBeatTimerId) {
      window.clearInterval(this.heartBeatTimerId)
      this.heartBeatTimerId = null
    }
    if (this.websocketInstance) {
      this.websocketInstance.onclose = (event) => {
        store.commit('websocket/SET_WEB_SOCKET_STATE', false)
        store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务连接关闭')
      }
      this.websocketInstance.close()
      this.websocketInstance = null
    }
  }

  heartBeat() {
    if (this.websocketInstance && this.websocketInstance.readyState === WebSocket.OPEN) {
      this.websocketInstance.send('HeartBeat' + new Date().getTime())
    }
  }
}