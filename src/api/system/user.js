import request from '@/rcore-axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/user/pagination',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/user/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/user/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/user',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/user',
    method: 'post',
    data: row
  })
}

export const getUser = (id) => {
  return request({
    url: '/api/user/' + id,
    method: 'get',
    params: {
      id
    }
  })
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
