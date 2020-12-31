import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/leave-note/leave-note', row)
}

export const removeById = (id) => {
  return request.delete('/api/leave-note/leave-note/' + id)
}

export const batchRemove = (ids) => {
  return request.delete('/api/leave-note/leave-note/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return request.put('/api/leave-note/leave-note', row)
}

export const getById = (id) => {
  return request.get('/api/leave-note/leave-note/' + id)
}

export const listWithPagination = (page, size, params) => {
  return request.get('/api/leave-note/leave-note/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}
