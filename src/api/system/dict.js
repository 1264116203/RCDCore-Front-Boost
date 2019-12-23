import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/dict/query',
    method: 'get',
    params: {
      ...params,
      page,
      size
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/dict/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/dict/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/dict',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/dict',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request({
    url: '/api/dict/' + id,
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request({
    url: '/api/dict/tree',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request({
    url: '/api/dict/dictionary',
    method: 'get',
    params
  })
}
