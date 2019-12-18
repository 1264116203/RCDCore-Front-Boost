import request from '@/rcore-axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/param/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getParam = (id) => {
  return request({
    url: '/api/blade-system/param/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/param/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/param/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/param/submit',
    method: 'post',
    data: row
  })
}
