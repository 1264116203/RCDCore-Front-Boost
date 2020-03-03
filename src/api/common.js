import axios from '@/rcore-axios'

export const login = (username, password, rememberMe) => (
  axios.post('/api/authenticate', { username, password, rememberMe })
)

export const checkAuthenticate = () => axios.get('/api/login-status/check', {
  validateStatus (status) {
    return (status >= 200 && status < 300) || status === 401
  }
})

export const refreshToken = (refreshToken, tenantId) => axios.post('/api/blade-auth/oauth/token', {
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

export const listCurrentUserButtons = () => axios.get('/api/authority/current-user/buttons')

export const getUserInfo = () => axios.get('/api/user/selfInfo')

export const sendLogs = (list) => axios.post('/api/user/logout', list)

// TODO 这里的请求是假的，是Mock的，事实上压根没有退出登录请求发出
export const logout = () => Promise.resolve()

// export const logout = () => request({
//   url: baseUrl + '/user/logout',
//   method: 'get'
// })

export const updatePassword = (oldPassword, newPassword) => {
  return axios.put('/api/user/update-password', {
    oldPassword,
    newPassword
  })
}

export const updateUserInfo = (userInfo) => {
  return axios.put('/api/user/self', userInfo)
}
