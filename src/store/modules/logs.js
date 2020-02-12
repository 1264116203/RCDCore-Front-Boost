import { setStore, getStore } from '@/util/browser-storage'
import { dateFormat } from '@/util/date'
import { sendLogs } from '@/api/common'

const logs = {
  state: {
    logList: getStore('logList') || []
  },
  actions: {
    sendLogs({ state, commit }) {
      return sendLogs(state.logList).then(() => {
        commit('CLEAR_LOGS')
      })
    }
  },
  mutations: {
    ADD_LOGS: (state, { type, message, stack, info }) => {
      state.logList.push(Object.assign({
        url: window.location.href,
        time: dateFormat(new Date())
      }, {
        type,
        message,
        stack,
        info: info.toString()
      }))
      setStore('logList', state.logList, 'locale')
    },
    CLEAR_LOGS: (state) => {
      state.logList = []
      setStore('logList', state.logList, 'locale')
    }
  }

}

export default logs
