import { setStore, getStore } from '@/util/browser-storage'
import website from '@/config/website'
import router from '@/router'
import { diff, guid } from '@/util/util'

const { firstPageCloseable, homepageTab } = website

// eslint-disable-next-line no-unused-vars
class Tab {
  // tab的主键
  key = ''
  // 标题名称
  label = ''
  // 标题的路径
  path = ''
  // 标题的路径参数
  params = {}
  // 标题的请求参数
  query = {}
  // 额外参数
  meta = {}
  // 分组
  group = []
  // 是否可关闭
  closeable = true
}

/**
 * 处理首个标签
 * @param list {[Tab]}
 */
function handleTabCloseable(list) {
  if (list.length === 1) {
    list[0].closeable = false
  } else {
    list.forEach(ele => {
      if (firstPageCloseable) {
        ele.closeable = true
      } else {
        ele.closeable = !(ele.path === homepageTab.path)
      }
    })
  }
}

function tabDiff(tab1, tab2) {
  // const name = tab1.label === tab2.label
  const path = tab1.path === tab2.path
  const params = diff(tab1.query, tab2.query)
  const query = diff(tab1.query, tab2.query)
  // const meta = diff(tab1.meta, tab2.meta)

  return path && params && query
}

const tabs = {
  namespaced: true,
  state: {
    // 标签列表
    tabList: getStore('tabList') || [homepageTab],

    // 当前标签key
    activeTabKey: '1',

    // 首页标签
    homepageTab: homepageTab,
    // 当前显示的是否为iframe
    isIframeShow: false
  },
  actions: {
    navTo({ commit, state }, tabElem) {
      if (!tabElem) {
        tabElem = state.homepageTab
      }

      router.push({
        path: tabElem.path,
        params: tabElem.params,
        query: tabElem.query,
        meta: tabElem.meta
      })
        .then(() => {
          commit('sidemenu/UPDATE_MENU_PATH', tabElem.path, { root: true })
        })
        .catch(reason => {
          if (reason && reason.name === 'NavigationDuplicated') {
          } else {
            console.error(reason)
          }
        })
    }
  },
  mutations: {
    SWITCH_TAB: (state, tab) => {
      // 如果已存在类似的Tab
      const found = state.tabList.find(val => tabDiff(tab, val))
      if (found) {
        state.activeTabKey = found.key
        return
      }

      if (!tab.key) {
        tab.key = guid()
      }
      state.tabList.push(tab)
      handleTabCloseable(state.tabList)
      setStore('tabList', state.tabList)
      state.activeTabKey = tab.key
    },
    CLOSE_TAB: (state, key) => {
      state.tabList = state.tabList.filter(item => {
        return item.key !== key
      })
      handleTabCloseable(state.tabList)
      setStore('tabList', state.tabList)
    },
    CLOSE_ALL: (state) => {
      state.tabList = [state.homepageTab]
      setStore('tabList', state.tabList)
    },
    CLOSE_OTHER: (state) => {
      state.tabList = state.tabList.filter(item => {
        if (item.path === state.nowTab.path) {
          return true
        } else if (!firstPageCloseable && item.path === homepageTab.path) {
          return true
        }
      })
      handleTabCloseable(state.tabList)
      setStore('tabList', state.tabList)
    },

    UPDATE_ACTIVE_TAB_KEY: (state, key) => {
      state.activeTabKey = key
    },

    UPDATE_IS_IFRAME_SHOW: (state, payload) => {
      state.isIframeShow = payload
    }
  }
}
export default tabs
