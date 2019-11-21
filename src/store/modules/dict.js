import { getStore, setStore } from '@/util/store'

import { getDictionary } from '@/api/system/dict'

const dict = {
  namespaced: true,
  state: {
    flowRoutes: getStore({ name: 'flowRoutes' }) || {}
  },
  actions: {
    // 发送错误日志
    flowRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getDictionary({ code: 'flow' }).then(res => {
          commit('SET_FLOW_ROUTES', res.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_FLOW_ROUTES: (state, data) => {
      state.flowRoutes = data.map(item => {
        return {
          routeKey: `${item.code}_${item.dictKey}`,
          routeValue: item.remark
        }
      })
      setStore('flowRoutes', state.flowRoutes)
    }
  }
}

export default dict
