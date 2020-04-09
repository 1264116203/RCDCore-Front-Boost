import { setStore, getStore } from '@/util/browser-storage'
import { getNotificationCount } from '@/api/notification/notification'

export default {
  namespaced: true,
  state: {
    // 是否显示消息组件
    showNewsDropdown: false,
    // 消息总数
    newsTotal: getStore('newsTotal') || '',
    // 是否显示详细信息组件
    detailsGrantVisible: false,
    // 详细信息ID
    detailsId: ''
  },
  actions: {
    getCount({ commit }) {
      return getNotificationCount({ read: false })
        .then(res => {
          commit('SET_NEWS_TOTAL', res.data)
        })
        .catch(err => console.error(err))
    }
  },
  mutations: {
    SET_NEWS_DROPDOWN: (state, showNewsDropdown) => {
      state.showNewsDropdown = showNewsDropdown
    },
    SET_NEWS_TOTAL: (state, newsTotal) => {
      state.newsTotal = newsTotal
      setStore('newsTotal', state.newsTotal)
    },
    SET_DETAILS_GRANT_VISIBLE: (state, detailsGrantVisible) => {
      state.detailsGrantVisible = detailsGrantVisible
    },
    SET_DETAILS_ID: (state, detailsId) => {
      state.detailsId = detailsId
    }
  }
}
