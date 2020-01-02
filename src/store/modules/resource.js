import { setStore, getStore } from '@/util/browser-storage'
import { getRoutes } from '@/api/system/menu'
const resource = {
  namespaced: true,
  state: {
    resourceTreeData: getStore('resourceTreeData') || []
  },
  actions: {
    getTree({ commit }) {
      return getRoutes().then(res => {
        const resourceTreeData = [{
          id: '0',
          name: '顶级菜单',
          children: res.data
        }]
        commit('SET_RESOURCE_DATA', resourceTreeData)
      })
    }
  },
  mutations: {
    SET_RESOURCE_DATA: (state, resourceTreeData) => {
      state.resourceTreeData = resourceTreeData
      setStore('resourceTreeData', state.resourceTreeData)
    }
  }
}

export default resource
