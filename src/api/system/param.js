import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/param/pagination',
    method: 'get',
    params: {
      ...params,
      page,
      size
    }
  })
}

export const getParam = (id) => {
  return request({
    url: '/api/param/' + id,
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/param/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/param/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/param',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/param',
    method: 'post',
    data: row
  })
}
