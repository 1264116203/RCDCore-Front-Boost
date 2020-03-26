export default {
  namespaced: true,
  state: {
    webSocketState: '',
    webSocketMsg: ''
  },
  mutations: {
    SET_WEB_SOCKET_STATE: (state, webSocketState) => {
      state.webSocketState = webSocketState
    },
    SET_WEB_SOCKET_MSG: (state, webSocketMsg) => {
      state.webSocketMsg = webSocketMsg
    }
  }
}
