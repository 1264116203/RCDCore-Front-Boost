import axios from '@/rcore-axios'

export const login = (username, password, rememberMe) => (
  axios.post('/api/authenticate', { username, password, rememberMe })
)

export const checkAuthenticate = () => axios.get('/api/login-status/check', {
  validateStatus (status) {
    return (status >= 200 && status < 300) || status === 401
  }
})

export const refreshToken = (refreshToken) => (
  axios.post('/api/authenticate/refresh-token', { refreshToken })
)

export const listCurrentUserButtons = () => axios.get('/api/authority/current-user/buttons')

export const getUserInfo = () => axios.get('/api/user/selfInfo')

export const sendLogs = (list) => axios.post('/api/user/logout', list)

export const logout = () => axios.post('/api/current-user/logout', null, {
  validateStatus (status) {
    return (status >= 200 && status < 300) || status === 401
  }
})

export const updatePassword = (oldPassword, newPassword) => {
  return axios.put('/api/user/update-password', {
    oldPassword,
    newPassword
  })
}

export const updateUserInfo = (userInfo) => {
  return axios.put('/api/user/self', userInfo)
}
