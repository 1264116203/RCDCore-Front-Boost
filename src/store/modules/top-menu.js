import { listAll } from '@/api/system/top-menu'

export default {
  namespaced: true,
  state: {
    topMenuList: []
  },
  actions: {
    getList({ commit }) {
      return listAll().then(res => {
        const dataList = res.data
        dataList.sort((a, b) => {
          let sa = a.sort ? a.sort : 100
          let sb = b.sort ? b.sort : 100
          return sa - sb
        })
        commit('SET_LIST', dataList)
      })
    }
  },
  mutations: {
    SET_LIST: (state, dataList) => {
      state.topMenuList = dataList
    }
  }
}
