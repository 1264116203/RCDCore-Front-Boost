import { getNotificationCount, getDetailsNotification, readNotification } from '@/api/notification/notification'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    // 是否显示消息组件
    dropdownVisible: false,
    // 消息总数
    total: 0,

    // 是否显示详细信息组件
    modalVisible: false,
    modalLoading: false,

    // 详细信息内容
    content: {}
  },
  actions: {
    getCount({ commit }) {
      return getNotificationCount({ read: false })
        .then(res => {
          if (res.data !== undefined) {
            commit('SET_TOTAL', res.data)
          }
        })
        .catch(err => console.error(err))
    },
    getDetailsContent({ state, commit }, id) {
      commit('SET_MODAL_LOADING', true)
      return getDetailsNotification(id)
        .then(res => {
          const data = res.data
          data.createTime = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
          commit('SET_CONTENT', data)
        })
        .catch(err => console.error(err))
        .finally(() => { commit('SET_MODAL_LOADING', false) })
    },
    readNotification({ state, commit }, id) {
      return readNotification(id)
    }
  },
  mutations: {
    SET_DROPDOWN_VISIBLE: (state, visible) => {
      state.dropdownVisible = visible
    },
    SET_TOTAL: (state, total) => {
      state.total = total
    },
    SET_MODAL_VISIBLE: (state, visible) => {
      state.modalVisible = visible
    },
    SET_MODAL_LOADING: (state, loading) => {
      state.modalLoading = loading
    },
    SET_CONTENT: (state, content) => {
      state.content = content
    }
  }
}
