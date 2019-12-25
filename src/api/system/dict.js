import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/dict/query', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const remove = (ids) => {
  return request.delete('/api/dict/batch', {
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/dict/' + id)
}

export const add = (row) => {
  return request.post('/api/dict', row)
}

export const update = (row) => {
  return request.post('/api/dict', row)
}

export const getDict = (id) => {
  return request.get('/api/dict/' + id)
}
export const getDictTree = () => {
  return request.get('/api/dict/tree')
}

export const getDictionary = (params) => {
  return request.get('/api/dict/dictionary', { params })
}
