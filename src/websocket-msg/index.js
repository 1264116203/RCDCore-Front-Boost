import store from '@/store'
export default class WebSocketConnection {
  constructor(option) {
    this.websocketInstance = null

    this.url = option.url
    this.token = option.token

    this.reconnectTimerId = null
    this.lockReconnect = false

    this.messageHandler = option.messageHandler ? option.messageHandler : function (data) {}

    this.establishConnection()
  }

  establishConnection() {
    try {
      const wsUrl = `${this.url}?token=${this.token}`
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '正在连接消息服务...')
      this.websocketInstance = new WebSocket(wsUrl)
    } catch (e) {
      this.reconnect()
    }

    this.websocketInstance.onopen = (event) => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', true)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务建立连接成功!')
    }

    this.websocketInstance.onmessage = (event) => {
      const data = event.data
      if (this.messageHandler) {
        this.messageHandler(data)
      }
    }

    // TODO 没有考虑到token已过期而此时尚未进行refreshToken导致重连失败的问题
    // TODO 没有考虑到token不合法导致无限重连的问题
    this.websocketInstance.onerror = (event) => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '发生异常了')
      setTimeout(() => {
        this.reconnect() // 重连
      }, 5000)
    }
    this.websocketInstance.onclose = (event) => {
      store.commit('websocket/SET_WEB_SOCKET_STATE', false)
      store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务连接断开，正在重连')
      setTimeout(() => {
        this.reconnect() // 重连
      }, 5000)
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
    if (this.websocketInstance) {
      this.websocketInstance.onclose = (event) => {
        store.commit('websocket/SET_WEB_SOCKET_STATE', false)
        store.commit('websocket/SET_WEB_SOCKET_MSG', '消息服务连接关闭')
      }
      this.websocketInstance.close()
      this.websocketInstance = null
    }
  }

  /** 消息回执 */
  receiptMessage(obj) {
    this.websocketInstance.send(obj)
  }
}
