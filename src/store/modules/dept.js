import { setStore, getStore } from '@/util/browser-storage'
import { getDeptTree } from '@/api/system/dept'
const dept = {
  namespaced: true,
  state: {
    deptData: getStore('deptData') || []
  },
  actions: {
    // 根据用户名登录
    getDeptData({ commit }) {
      return getDeptTree().then(res => {
        // const deptData = res.data
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
