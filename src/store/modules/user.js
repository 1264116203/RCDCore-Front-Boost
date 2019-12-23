import { setToken, setRefreshToken, removeToken, removeRefreshToken } from '@/util/auth'
import { setStore, getStore } from '@/util/browser-storage'
import { validateNull } from '@/util/validate'
import { deepClone } from '@/util/util'
import website from '@/config/website'
import { login, getUserInfo, logout, refreshToken, getButtons } from '@/api/user'
import { getTopMenu, getRoutes } from '@/api/system/menu'

function addPath(ele, first = false) {
  // 设置图标，如果不存在则使用默认图标
  const icon = ele.icon
  ele.icon = validateNull(icon) ? website.menu.iconDefault : icon

  const hasChildren = ele.children && ele.children.length !== 0

  if (hasChildren) {
    ele.children.forEach(child => {
      addPath(child)
    })
  } else {
    ele.children = []
  }
}

const user = {
  namespaced: true,
  state: {
    // 租户ID
    tenantId: getStore('tenantId') || '',
    // 用户信息
    userInfo: getStore('userInfo') || {},
    // 权限Map，键：权限名，值：布尔
    permission: getStore('permission') || {},
    // 角色列表
    roleList: [],
    // 菜单列表
    menuList: getStore('menuList') || [],
    // 令牌
    token: getStore('token') || '',
    // 刷新令牌
    refreshToken: getStore('refreshToken') || ''
  },
  actions: {
    // 根据用户名登录
    loginByUsername({ commit }, userInfo) {
      return login(userInfo.username, userInfo.password, userInfo.rememberMe)
        .then(res => {
          const data = res.data
          if (data.error_description) {
            return Promise.reject(data.error_description)
          } else {
            // commit('SET_TOKEN', data.access_token)
            commit('SET_TOKEN', data.token)
            // commit('SET_REFRESH_TOKEN', data.refresh_token)
            // commit('SET_TENANT_ID', data.tenant_id)
            commit('SET_USER_INFO', data)
            commit('tabs/CLOSE_ALL', null, { root: true })
            commit('common/UNLOCK', null, { root: true })
          }
        })
    },
    getButtons({ commit }) {
      return getButtons().then(res => {
        const data = res.data
        commit('SET_PERMISSION', data)
      })
    },
    // 根据手机号登录
    loginByPhone({ commit }, userInfo) {
      return login(userInfo.phone, userInfo.code).then(res => {
        const data = res.data.data
        commit('SET_TOKEN', data)
        commit('tabs/CLOSE_ALL', null, { root: true })
        commit('common/UNLOCK')
      })
    },
    getRoleList({ commit }) {
      return getUserInfo().then((res) => {
        const data = res.data.data
        commit('SET_ROLE_LIST', data.roles)
        return Promise.resolve(data)
      })
    },
    // 刷新token
    refreshToken({ state, commit }) {
      console.log('handle refresh token')
      return refreshToken(state.refreshToken, state.tenantId).then(res => {
        const data = res.data
        commit('SET_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
      })
    },
    // 登出
    logout({ commit, dispatch }) {
      return logout().then(() => {
        dispatch('clearAllAuthInfos')
      })
    },
    // 注销session
    clearAllAuthInfos({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_MENU_LIST', [])
      commit('SET_ROLE_LIST', [])
      commit('tabs/CLOSE_ALL', null, { root: true })
      commit('common/UNLOCK', null, { root: true })
      removeToken()
      removeRefreshToken()
    },
    // 获取顶部菜单
    getTopMenu() {
      return getTopMenu().then((res) => {
        const data = res.data.data || []
        return Promise.resolve(data)
      })
    },
    // 获取系统菜单
    getMenu({ commit, dispatch }, topMenuId) {
      return getRoutes(topMenuId).then((res) => {
        const data = res.data
        let menu = deepClone(data)
        menu.forEach(ele => {
          addPath(ele, true)
        })
        commit('SET_MENU_LIST', menu)
        dispatch('getButtons')
        return Promise.resolve(menu)
      })
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
      setStore('token', state.token)
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
      setRefreshToken(refreshToken)
      setStore('refreshToken', state.refreshToken)
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
      setStore('tenantId', state.tenantId)
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore('userInfo', state.userInfo, 'local')
    },
    SET_MENU_LIST: (state, list) => {
      state.menuList = list
      setStore('menuList', state.menuList)
    },
    SET_ROLE_LIST: (state, roles) => {
      state.roleList = roles
    },
    SET_PERMISSION: (state, permission) => {
      let result = [];

      (function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const children = ele.children
            const code = ele.code
            if (children) {
              getCode(children)
            } else {
              result.push(code)
            }
          }
        })
      })(permission)

      state.permission = {}
      result.forEach(ele => {
        state.permission[ele] = true
      })
      setStore('permission', state.permission)
    }
  }

}
export default user
