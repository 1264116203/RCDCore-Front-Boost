import request from '@/rcore-axios'
import { baseUrl } from '@/config/env'
export const login = (username, password, rememberMe) => (
  request.post('/api/authenticate', { username, password, rememberMe })
)

export const login1 = (rememberMe, username, password) => request({
  url: '/api/authenticate',
  method: 'post',
  params: {
    username,
    password,
    // grant_type: 'password',
    // scope: 'all',
    rememberMe
  }
})

export const refreshToken = (refreshToken, tenantId) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'all'
  }
})

export const getButtons = () => request({
  url: '/api/menu/buttons',
  method: 'get'
})

export const getUserInfo = () => request({
  url: baseUrl + '/user/getUserInfo',
  method: 'get'
})

export const sendLogs = (list) => request({
  url: baseUrl + '/user/logout',
  method: 'post',
  data: list
})

// TODO 这里的请求是假的，是Mock的，事实上压根没有退出登录请求发出
export const logout = () => Promise.resolve()

// export const logout = () => request({
//   url: baseUrl + '/user/logout',
//   method: 'get'
// })
