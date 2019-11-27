import {
  setStore,
  getStore,
  removeStore
} from '@/util/browser-storage'
import website from '@/config/website'

const common = {
  namespaced: true,
  state: {
    // 系统语言
    language: getStore('language') || 'zh',
    // 左侧菜单是否折叠
    isCollapse: false,
    // 是否为全屏模式
    isFullScreen: false,
    // 屏幕大小，0超小屏幕，1小屏幕，2中屏幕，3大屏幕，详见admin.js
    screen: -1,
    // 是否锁屏
    isLock: getStore('isLock') || false,
    // 是否显示标签栏
    showTab: true,
    // 是否展示前端错误日志列表
    showLogRecord: true,
    // 是否显示菜单折叠按钮
    showCollapse: true,
    // 是否显示搜索栏
    showSearch: true,
    // 是否显示锁屏按钮
    showLock: true,
    // 是否显示全屏切换按钮
    showFullScreen: true,
    // 是否显示主题切换按钮
    showTheme: true,
    // 是否显示菜单
    showMenu: true,
    // 是否显示页脚
    showFooter: true,
    // 是否显示主题颜色切换按钮
    showColor: true,
    // 主题颜色
    // themeColor: getStore('themeColor') || '#409EFF',
    // 主题名
    themeName: getStore('themeName') || 'default-theme',
    // 锁屏密码
    lockPassword: getStore('lockPwd') || '',
    // 站点元数据
    website: website
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore('language', state.language, 'local')
    },
    TOGGLE_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse
    },
    TOGGLE_FULLSCREEN: (state) => {
      state.isFullScreen = !state.isFullScreen
    },
    SET_LOCK: (state) => {
      state.isLock = true
      setStore('isLock', state.isLock)
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName
      setStore('themeName', state.themeName, 'locale')
    },
    SET_LOCK_PASSWORD: (state, password) => {
      state.lockPasswd = password
      setStore('lockPwd', state.lockPassword)
    },
    UNLOCK: (state) => {
      state.isLock = false
      state.lockPassword = ''
      removeStore('lockPwd')
      removeStore('isLock')
    }
  }
}
export default common
