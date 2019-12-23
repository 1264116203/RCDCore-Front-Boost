import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request({
    url: '/api/role/query',
    method: 'get',
    params: {
      ...params,
      page,
      size
    }
  })
}
export const grantTree = () => {
  return request({
    url: '/api/menu/grant-top-tree',
    method: 'get'
  })
}

export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds) => {
  return request({
    url: '/api/role/grant',
    method: 'post',
    data: {
      roleIds,
      menuIds,
      dataScopeIds,
      apiScopeIds
    }
  })
}

export const getRole = (id) => {
  return request({
    url: '/api/role/' + id,
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/role/batch',
    method: 'DELETE',
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/role/' + id)
}

export const add = (row) => {
  return request({
    url: '/api/role',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/role',
    method: 'post',
    data: row
  })
}

export const getRoleTreeKeys = (roleIds) => {
  return request({
    url: '/api/menu/top-tree-keys',
    method: 'get',
    params: {
      roleIds
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/role/tree',
    method: 'get',
    params: {
      tenantId
    }
  })
}
