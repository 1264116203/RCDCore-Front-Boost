import { setStore, getStore } from '@/util/browser-storage'
import { listWithTree } from '@/api/system/dept'
const dept = {
  namespaced: true,
  state: {
    deptData: getStore('deptData') || []
  },
  actions: {
    getDeptData({ commit }) {
      return listWithTree().then(res => {
        const deptData = [{
          value: '0',
          key: '0',
          title: '顶级部门',
          children: res.data
        }]
        commit('SET_DEPT_DATA', deptData)
      })
    }
  },
  mutations: {
    SET_DEPT_DATA: (state, deptData) => {
      state.deptData = deptData
      setStore('deptData', state.deptData)
    }
  }
}

export default dept
