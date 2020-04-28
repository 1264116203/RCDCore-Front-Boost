import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/dept', row)
}

export const removeById = (id) => {
  return request.delete('/api/dept/' + id)
}

export const batchRemove = (ids) => {
  return request.delete('/api/dept/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return request.put('/api/dept', row)
}

export const getById = (id) => {
  return request.get('/api/dept/' + id)
}
export const listWithTree = (searchInfo) => {
  return request.get('/api/dept/tree', {
    params: {
      ...searchInfo
    }
  })
}
