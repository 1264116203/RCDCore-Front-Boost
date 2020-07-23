import { listAllWithTree } from '@/api/system/role'
import { deepSort } from '@/util/tree'

export default {
  namespaced: true,
  state: {
    roleTreeData: []
  },
  actions: {
    getTree({ commit }) {
      return listAllWithTree().then(res => {
        const roleTreeData = [{
          value: '0',
          key: '0',
          title: '顶级角色',
          children: res.data
        }]
        deepSort(roleTreeData, (a, b) => {
          let sa = a.sort ? a.sort : 100
          let sb = b.sort ? b.sort : 100
          return sa - sb
        })
        commit('SET_ROLE_DATA', roleTreeData)
      })
    }
  },
  mutations: {
    SET_ROLE_DATA: (state, roleTreeData) => {
      state.roleTreeData = roleTreeData
    }
  }
}
