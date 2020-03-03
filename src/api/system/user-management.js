import axios from '@/rcore-axios'

export const getList = (current, size, params) => {
  return axios.get('/api/user/pagination', { params: { page: current, size, ...params } })
}

export const remove = (ids) => {
  return axios.delete('/api/user/batch', { params: { ids } })
}

export const singleRemove = (id) => {
  return axios.delete('/api/user/' + id)
}

export const add = (row) => {
  return axios.post('/api/user', row)
}

export const update = (row) => {
  return axios.put('/api/user', row)
}

export const getUser = (id) => {
  return axios.get('/api/user/' + id)
}

/** 重置密码 */
export const resetPassword = (password, userIdList) => {
  return axios.put('/api/user/reset-password', {
    password,
    userIdList
  })
}
