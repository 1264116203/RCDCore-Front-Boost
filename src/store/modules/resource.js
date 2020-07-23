import { listAllWithTree } from '@/api/system/authority'
import { deepSort } from '@/util/tree'

export default {
  namespaced: true,
  state: {
    resourceTreeData: []
  },
  actions: {
    getTree({ commit }) {
      return listAllWithTree().then(res => {
        /** Tree 下拉选的数据格式 */
        function transformTreeData(data) {
          function transform(data) {
            if (data.children) {
              data.children = data.children.map(transform)
            }
            return {
              ...data,
              name: data.title,
              key: data.id,
              value: data.id
            }
          }
          return data.map(transform)
        }

        const resourceTreeData = [{
          id: '0',
          title: '顶级菜单',
          children: res.data
        }]
        deepSort(resourceTreeData, (a, b) => {
          let sa = a.sort ? a.sort : 100
          let sb = b.sort ? b.sort : 100
          return sa - sb
        })
        commit('SET_RESOURCE_DATA', transformTreeData(resourceTreeData))
      })
    }
  },
  mutations: {
    SET_RESOURCE_DATA: (state, resourceTreeData) => {
      state.resourceTreeData = resourceTreeData
    }
  }
}
