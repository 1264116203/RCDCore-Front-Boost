<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.description"
        >
          <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-spin>
</template>
<script>
// import { mapGetters } from 'vuex'
import WebSocketConnection from '@/webSocket/web-socket'

export default {
  data() {
    return {
      data: [],
      isLoading: false,
      sconn: null
    }
  },
  // computed: {
  //   ...mapGetters(['token'])
  // },
  created () {
    const sconn = new WebSocketConnection({
      url: 'ws://172.25.34.83:8088/websocket/messaging',
      token: 'abc',
      messageHandler: (data) => {
        this.$message.info(data)
      }
    })
    this.sconn = sconn
  },
  destroyed () {
    this.sconn.destroy()
  },
  methods: {

    // initWebSocket () { // 初始化weosocket
    //   this.destroyWebSocket()
    //   try {
    //     console.log('连接websocket')
    //     const wsurl = 'ws://172.25.34.83:8088/websocket/messaging?token=abc'
    //     this.webSocket = new WebSocket(wsurl)
    //     this.webSocket.onopen = (event) => {
    //       console.log('send:' + this.currSceneInfo)
    //       // this.webSocket.send(this.currSceneInfo.id)
    //       this.heartCheck.start(this.webSocket) // 心跳
    //     }
    //     this.webSocket.onmessage = (event) => {
    //       if (event.data === 'HeartBeat') {
    //         console.log('收到了心跳检测')
    //         this.heartCheck.start(this.webSocket) // 心跳
    //       } else {
    //         this.data = event.data
    //         console.log(this.data)
    //       }
    //     }
    //     this.webSocket.onerror = () => {
    //       console.log('发生异常了')
    //       this.reconnect() // 重连
    //     }
    //     this.webSocket.onclose = (event) => {
    //       console.log('断线重连')
    //       this.reconnect() // 重连
    //     }
    //   } catch (e) {
    //     console.log(e.message)
    //     this.reconnect()
    //   }
    // },

    // destroyWebSocket () {
    //   if (this.webSocket) {
    //     this.webSocket.onclose = (event) => {
    //       console.log('链接关闭')
    //     }
    //     this.webSocket.close()
    //     this.webSocket = null
    //   }
    // },

    // reconnect () {
    //   if (this.lockReconnect) {
    //     return
    //   }
    //   this.lockReconnect = true
    //   // 没连接上会一直重连，设置延迟避免请求过多
    //   this.tt && clearTimeout(this.tt)
    //   this.tt = setTimeout(() => {
    //     this.initWebSocket()
    //     this.lockReconnect = false
    //   }, 4000)
    // }
  }
}
</script>
<style lang="less">
.news-list{
  .ant-list-item{
  padding: 12px;
  }
}
</style>
