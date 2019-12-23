import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/topmenu/pagination',
    method: 'get',
    params: {
      ...params,
      page,
      size
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/topmenu/' + id,
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/topmenu/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/topmenu/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/topmenu',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/topmenu',
    method: 'PUT',
    data: row
  })
}

export const grantTree = () => {
  return request({
    url: '/api/menu/grant-top-tree',
    method: 'get'
  })
}

export const getTopTree = (topMenuIds) => {
  return request({
    url: '/api/menu/top-tree-keys',
    method: 'get',
    params: {
      topMenuIds
    }
  })
}

export const grant = (topMenuIds, menuIds) => {
  return request({
    url: '/api/topmenu/grant',
    method: 'post',
    params: {
      topMenuIds,
      menuIds
    }
  })
}
