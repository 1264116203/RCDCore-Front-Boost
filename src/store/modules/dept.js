import { listWithTree } from '@/api/system/dept'
import { deepForEach, deepSort } from '@/util/tree'

export default {
  namespaced: true,
  state: {
    deptData: []
  },
  getters: {
    deptIdNameMap: state => {
      const map = new Map()
      deepForEach(state.deptData, elem => {
        map.set(elem.id, elem.title)
      })
      return map
    }
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
        deepSort(deptData, (a, b) => {
          let sa = a.sort ? a.sort : 100
          let sb = b.sort ? b.sort : 100
          return sa - sb
        })
        commit('SET_DEPT_DATA', deptData)
      })
    }
  },
  mutations: {
    SET_DEPT_DATA: (state, deptData) => {
      state.deptData = deptData
    }
  }
}
