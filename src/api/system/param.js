import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/param/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const getParam = (id) => {
  return request.get('/api/param/' + id)
}

export const remove = (ids) => {
  return request.delete('/api/param/batch', {
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/param/' + id)
}

export const add = (row) => {
  return request.post('/api/param', row)
}

export const update = (row) => {
  return request.put('/api/param', row)
}
