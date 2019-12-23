import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/menu/query',
    method: 'get',
    params: {
      page,
      size,
      ...params
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/menu/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/menu/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/menu',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/menu',
    method: 'post',
    data: row
  })
}

export const getMenu = (id) => {
  return request({
    url: '/api/menu/' + id,
    method: 'get'
  })
}

export const getTopMenu = () => request({
  url: '/api/menu/top-menu',
  method: 'get'
})

export const getRoutes = (topMenuId) => request({
  url: '/api/menu/routes',
  method: 'get',
  params: {
    topMenuId
  }
})
