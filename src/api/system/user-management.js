import request from '@/rcore-axios'

export const getList = (current, size, params) => {
  return request.get('/api/user/pagination', { params: { page: current, size, ...params } })
}

export const remove = (ids) => {
  return request.delete('/api/user/batch', { params: { ids } })
}

export const singleRemove = (id) => {
  return request.delete('/api/user/' + id)
}

export const add = (row) => {
  return request.post('/api/user', row)
}

export const update = (row) => {
  return request.put('/api/user', row)
}

export const getUser = (id) => {
  return request.get('/api/user/' + id)
}

/** 重置密码 */
export const restetPassword = (password, userIdList) => {
  return request.put('/api/user/reset-password', {
    password,
    userIdList
  })
}
