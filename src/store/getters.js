export default {
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

  nowTab: state => {
    const { tabList, activeTabKey } = state.tabs
    return tabList.find(elem => elem.key === activeTabKey)
  },
  tabList: state => state.tabs.tabList,
  iframeTabList: state => {
    const { tabList } = state.tabs
    return tabList.filter(elem => elem.meta && elem.meta.isIframe)
  },
  homepageTab: state => state.tabs.homepageTab,

  token: state => state.user.token,
  refreshToken: state => state.user.refreshToken,
  authenticated: state => state.user.authenticated,
  userInfo: state => state.user.userInfo,
  // TODO 菜单列表后续也要改名或移除
  menuList: state => state.user.menuList,
  permission: state => state.user.permission,

  deptList: state => state.dept.deptData,
  roleList: state => state.role.roleTreeData,
  resourceList: state => state.resource.resourceTreeData
}
