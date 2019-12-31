import { getStore, setStore } from '@/util/browser-storage'
import { getDictionary, getDictTree } from '@/api/system/dict'

const dict = {
  namespaced: true,
  state: {
    flowRoutes: getStore('flowRoutes') || {},
    dictTreeData: getStore('dictTreeData') || []
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
    },
    getTree({ commit }) {
      return getDictTree().then(res => {
        const dictTreeData = [{
          value: '0',
          key: '0',
          title: '顶级字典',
          children: res.data
        }]
        commit('SET_DICT_DATA', dictTreeData)
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
    },
    SET_DICT_DATA: (state, dictTreeData) => {
      state.dictTreeData = dictTreeData
      setStore('dictTreeData', state.dictTreeData)
    }
  }
}

export default dict
