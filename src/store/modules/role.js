import { setStore, getStore } from '@/util/browser-storage'
import { getRoleTree } from '@/api/system/role'
const role = {
  namespaced: true,
  state: {
    RoleParentData: getStore('RoleParentData') || []
  },
  actions: {
    getRoleParentData({ commit }) {
      return getRoleTree().then(res => {
        const RoleParentData = [{
          value: '0',
          key: '0',
          title: '顶级角色',
          children: res.data
        }]
        commit('SET_ROLE_DATA', RoleParentData)
      })
    }
  },
  mutations: {
    SET_ROLE_DATA: (state, RoleParentData) => {
      state.RoleParentData = RoleParentData
      setStore('RoleParentData', state.RoleParentData)
    }
  }
}

export default role
