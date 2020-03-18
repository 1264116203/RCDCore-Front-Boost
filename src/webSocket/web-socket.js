/** 避免重复连接 */
var lockReconnect = false
var webSocket
var tt

/** websocket心跳检测 */
var heartCheck = {
  timeout: 6000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function (ws) {
    var self = this
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      if (ws.readyState === 3) {
        return
      }
      console.log('发送了心跳检测')
      ws.send('HeartBeat')
      self.serverTimeoutObj = setTimeout(function () {
        console.log('检测不到心跳')
        ws.close()
      }, self.timeout)
    }, this.timeout)
  }
}

/** websocket启动 */
export function _initWebSocket () { // 初始化weosocket
  let data
  destroyWebSocket()
  try {
    console.log('连接websocket')
    const wsurl = 'ws://172.25.34.83:8088/websocket/messaging?token=abc'
    webSocket = new WebSocket(wsurl)
    webSocket.onopen = (event) => {
      heartCheck.start(webSocket) // 心跳
    }
    webSocket.onmessage = (event) => {
      if (event.data === 'HeartBeat') {
        console.log('收到了心跳检测')
        heartCheck.start(webSocket) // 心跳
      } else {
        data = event.data
        console.log(data)
      }
    }
    webSocket.onerror = () => {
      console.log('发生异常了')
      reconnect() // 重连
    }
    webSocket.onclose = (event) => {
      console.log('断线重连')
      reconnect() // 重连
    }
  } catch (e) {
    console.log(e.message)
    reconnect()
  }
  return data
}

/** 销毁WebSocket */
function destroyWebSocket () {
  if (webSocket) {
    webSocket.onclose = (event) => {
      console.log('链接关闭')
    }
    webSocket.close()
    webSocket = null
  }
}

/** websocket重连 */
function reconnect () {
  if (lockReconnect) {
    return
  }
  lockReconnect = true
  // 没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt)
  tt = setTimeout(() => {
    _initWebSocket()
    lockReconnect = false
  }, 4000)
}
