import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/param', row)
}

export const removeById = (id) => {
  return request.delete('/api/param/' + id)
}

export const batchRemove = (ids) => {
  return request.delete('/api/param/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return request.put('/api/param', row)
}

export const getById = (id) => {
  return request.get('/api/param/' + id)
}

export const listWithPagination = (page, size, params) => {
  return request.get('/api/param/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}
