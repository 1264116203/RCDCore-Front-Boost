import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/dept/query', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const remove = (ids) => {
  return request.delete('/api/dept/batch', {
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/dept/' + id)
}

export const add = (row) => {
  return request.post('/api/dept', { data: row })
}

export const update = (row) => {
  return request.post('/api/dept', { data: row })
}

export const getDept = (id) => {
  return request.get('/api/dept/' + id)
}
export const getDeptTree = (tenantId) => {
  return request.get('/api/dept/tree', {
    params: {
      tenantId
    }
  })
}
