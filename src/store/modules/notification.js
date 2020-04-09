import { setStore, getStore } from '@/util/browser-storage'
import { getNotificationCount, getDetailsNotification } from '@/api/notification/notification'
import moment from 'moment'

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
    detailsId: '',
    // 详细信息内容
    detailsContent: []
  },
  actions: {
    getCount({ commit }) {
      return getNotificationCount({ read: false })
        .then(res => {
          commit('SET_NEWS_TOTAL', res.data)
        })
        .catch(err => console.error(err))
    },
    getDetailsContent({ state, commit }) {
      return getDetailsNotification(state.detailsId)
        .then(res => {
          let detailsData = []
          detailsData.push(res.data)
          /** 转换为时间格式 */
          detailsData.map(item => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
          commit('SET_DETAILS_CONTENT', detailsData)
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
    },
    SET_DETAILS_CONTENT: (state, detailsContent) => {
      state.detailsContent = detailsContent
      setStore('detailsContent', state.detailsContent)
    }
  }
}
