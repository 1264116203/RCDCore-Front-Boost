import axios from '@/rcore-axios'

export const add = (row) => {
  return axios.post('/api/user', row)
}

export const removeById = (id) => {
  return axios.delete('/api/user/' + id)
}

export const batchRemove = (ids) => {
  return axios.delete('/api/user/batch', { params: { ids } })
}

export const update = (row) => {
  return axios.put('/api/user', row)
}

export const getById = (id) => {
  return axios.get('/api/user/' + id)
}

export const listWithPagination = (current, size, params) => {
  return axios.get('/api/user/pagination', { params: { page: current, size, ...params } })
}

/** 重置密码 */
export const resetPassword = (password, userIdList) => {
  return axios.put('/api/user/reset-password', {
    password,
    userIdList
  })
}
