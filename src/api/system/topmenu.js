import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/topmenu/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const getDetail = (id) => {
  return request.get('/api/topmenu/' + id)
}

export const remove = (ids) => {
  return request.delete('/api/topmenu/batch', { params: { ids } })
}

export const singleRemove = (id) => {
  return request.delete('/api/topmenu/' + id)
}

export const add = (row) => {
  return request.post('/api/topmenu', row)
}

export const update = (row) => {
  return request.put('/api/topmenu', row)
}

export const grantTree = () => {
  return request.get('/api/menu/grant-top-tree')
}

export const getTopTree = (topMenuIds) => {
  return request.get('/api/menu/top-tree-keys', { params: { topMenuIds } })
}

export const grant = (topMenuIds, menuIds) => {
  return request.post('/api/topmenu/grant', { params: { topMenuIds, menuIds } })
}
