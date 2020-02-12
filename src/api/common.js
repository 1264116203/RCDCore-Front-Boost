import request from '@/rcore-axios'
import { baseUrl } from '@/config/env'

export const login = (username, password, rememberMe) => (
  request.post('/api/authenticate', { username, password, rememberMe })
)

export const refreshToken = (refreshToken, tenantId) => request.post('/api/blade-auth/oauth/token', {
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

export const getButtons = () => request.get('/api/menu/buttons')

export const getUserInfo = () => request.get('/api/user/selfInfo')

export const sendLogs = (list) => request.post(baseUrl + '/user/logout', list)

// TODO 这里的请求是假的，是Mock的，事实上压根没有退出登录请求发出
export const logout = () => Promise.resolve()

// export const logout = () => request({
//   url: baseUrl + '/user/logout',
//   method: 'get'
// })

export const updatePassword = (oldPassword, newPassword) => {
  return request.put('/api/user/update-password', {
    oldPassword,
    newPassword
  })
}
