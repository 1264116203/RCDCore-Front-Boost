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

export const getUserInfo = () => {
  return request({
    url: '/api/blade-user/info',
    method: 'get'
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/api/blade-user/reset-password',
    method: 'post',
    params: {
      userIds
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/api/blade-user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1
    }
  })
}
