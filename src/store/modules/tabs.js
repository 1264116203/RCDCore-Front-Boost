import { setStore, getStore } from '@/util/browser-storage'
import { diff } from '@/util/util'
import website from '@/config/website'

const firstPageClosable = website.firstPageClosable
const dashboardView = website.firstPage

class Tab {
  // 标题名称
  label = ''
  // 标题的路径
  value = ''
  // 标题的路径参数
  params = ''
  // 标题的参数
  query = ''
  // 额外参数
  meta = {}
  // 分组
  group = []
}

// 处理首个标签
function setFirstTag(list) {
  if (list.length === 1) {
    list[0].close = false
  } else {
    list.forEach(ele => {
      ele.close = !(ele.value === dashboardView.value && firstPageClosable === false)
    })
  }
}

const tabs = {
  namespaced: true,
  state: {
    // 当前标签
    nowTab: getStore('tab') || new Tab(),
    // 标签列表
    tabList: getStore('tabList') || [],
    // 首页标签
    dashboardTab: dashboardView
  },
  actions: {},
  mutations: {
    ADD_TAB: (state, tab) => {
      state.nowTab = tab
      setStore('nowTab', state.tab)

      if (!state.tabList.some(ele => diff(ele, tab))) {
        state.tabList.push(tab)
        setFirstTag(state.tabList)
        setStore('tabList', state.tabList)
      }
    },
    CLOSE_TAB: (state, action) => {
      state.tabList = state.tabList.filter(item => {
        return !diff(item, action)
      })
      setFirstTag(state.tabList)
      setStore('tabList', state.tabList)
    },
    CLOSE_ALL: (state) => {
      state.tabList = [state.dashboardTab]
      setStore('tabList', state.tabList)
    },
    CLOSE_OTHER: (state) => {
      state.tabList = state.tabList.filter(item => {
        if (item.value === state.tab.value) {
          return true
        } else if (!firstPageClosable && item.value === dashboardView.value) {
          return true
        }
      })
      setFirstTag(state.tabList)
      setStore('tabList', state.tabList)
    }
  }
}
export default tabs
