import request from '@/rcore-axios'

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
  return request.post('/api/dept', row)
}

export const update = (row) => {
  return request.put('/api/dept', row)
}

export const getDept = (id) => {
  return request.get('/api/dept/' + id)
}
export const getDeptTree = (searchInfo) => {
  return request.get('/api/dept/tree', {
    params: {
      ...searchInfo
    }
  })
}
