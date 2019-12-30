import { setStore, getStore } from '@/util/browser-storage'
import { getRoleTree } from '@/api/system/role'
const role = {
  namespaced: true,
  state: {
    roleTreeData: getStore('roleTreeData') || []
  },
  actions: {
    getTree({ commit }) {
      return getRoleTree().then(res => {
        const roleTreeData = [{
          value: '0',
          key: '0',
          title: '顶级角色',
          children: res.data
        }]
        commit('SET_ROLE_DATA', roleTreeData)
      })
    }
  },
  mutations: {
    SET_ROLE_DATA: (state, roleTreeData) => {
      state.roleTreeData = roleTreeData
      setStore('roleTreeData', state.roleTreeData)
    }
  }
}

export default role
