import request from '@/rcore-axios'

export const getList = (params) => {
  return request.get('/api/menu/query', {
    params: {
      ...params
    }
  })
}

export const remove = (ids) => {
  return request.delete('/api/menu/batch', {
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/menu/' + id)
}

export const add = (row) => {
  return request.post('/api/menu', row)
}

export const update = (row) => {
  return request.post('/api/menu', row)
}

export const getMenu = (id) => {
  return request.get('/api/menu/' + id)
}

export const getTopMenu = () => {
  return request.get('/api/menu/top-menu')
}

export const getRoutes = (topMenuId) => {
  return request.get('/api/menu/routes', {
    params: {
      topMenuId
    }
  })
}

export const listWithTree = () => {
  return request.get('/api/menu/tree')
}
