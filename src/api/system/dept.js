import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/dept/query',
    method: 'get',
    params: {
      page,
      size,
      ...params
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/dept/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/dept/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/dept',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/dept',
    method: 'post',
    data: row
  })
}

export const getDept = (id) => {
  return request({
    url: '/api/dept/' + id,
    method: 'get',
    params: {
      id
    }
  })
}
export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/dept/tree',
    method: 'get',
    params: {
      tenantId
    }
  })
}
