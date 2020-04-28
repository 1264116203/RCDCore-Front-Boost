import axios from '@/rcore-axios'

/** 用户登录 */
export const login = (username, password, rememberMe, pwdEncoded) => (
  axios.post('/api/authenticate', { username, password, rememberMe, pwdEncoded })
)

/** 检查登录状态（令牌合法性） */
export const checkAuthenticate = () => axios.get('/api/login-status/check', {
  validateStatus (status) {
    return (status >= 200 && status < 300) || status === 401
  }
})

/** 使用刷新令牌重新获取token */
export const refreshToken = (refreshToken) => (
  axios.post('/api/authenticate/refresh-token', { refreshToken })
)

/** 拉取当前用户的按钮信息 */
export const listCurrentUserButtons = () => axios.get('/api/authority/current-user/buttons')

/** 拉取当前登录用户的信息 */
export const getUserInfo = () => axios.get('/api/user/selfInfo')

/** 用户注销 */
export const logout = () => axios.post('/api/current-user/logout', null, {
  validateStatus (status) {
    return (status >= 200 && status < 300) || status === 401
  }
})

/** 用户密码重设 */
export const updatePassword = (oldPassword, newPassword) => {
  return axios.put('/api/user/update-password', {
    oldPassword,
    newPassword
  })
}

/** 更新用户个人信息 */
export const updateUserInfo = (userInfo) => {
  return axios.put('/api/user/self', userInfo)
}
