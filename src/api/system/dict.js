import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/dict', row)
}

export const removeById = (id) => {
  return request.delete('/api/dict/' + id)
}

export const batchRemove = (ids) => {
  return request.delete('/api/dict/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return request.put('/api/dict', row)
}

export const getById = (id) => {
  return request.get('/api/dict/' + id)
}

export const listWithPagination = (page, size, params) => {
  return request.get('/api/dict/pagination', {
    params: {
      page,
      size,
      ...params
    }
  })
}
