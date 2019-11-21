const getters = {
  website: state => state.common.website,
  language: state => state.common.language,
  themeName: state => state.common.themeName,
  screen: state => state.common.screen,
  isCollapse: state => state.common.isCollapse,
  isLock: state => state.common.isLock,
  isFullScreen: state => state.common.isFullScreen,
  lockPassword: state => state.common.lockPassword,
  actualCollapse: (state, getters) =>
    getters.screen > 1 ? getters.isCollapse : false,

  nowTab: state => state.tabs.nowTab,
  tabList: state => state.tabs.tabList,
  dashboardTab: state => state.tabs.dashboardTab,

  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roleList: state => state.user.roleList,
  menuList: state => state.user.menuList,
  permission: state => state.user.permission,

  logList: state => state.logs.logList,
  logListLength: state => state.logs.logList.length || 0,
  logFlag: (state, getters) => getters.logListLength === 0,

  flowRoutes: state => state.dict.flowRoutes
}

export default getters
