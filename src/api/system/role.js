import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/role/query', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const grantTree = () => {
  return request.get('/api/menu/grant-top-tree')
}

export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds) => {
  return request.post('/api/role/grant', {
    data: {
      roleIds,
      menuIds,
      dataScopeIds,
      apiScopeIds
    }
  })
}

export const getRole = (id) => {
  return request.get('/api/role/' + id)
}

export const remove = (ids) => {
  return request.delete('/api/role/batch', {
    params: {
      ids
    }
  })
}

export const singleRemove = (id) => {
  return request.delete('/api/role/' + id)
}

export const add = (row) => {
  return request.post('/api/role', { data: row })
}

export const update = (row) => {
  return request.post('/api/role', { data: row })
}

export const getRoleTreeKeys = (roleIds) => {
  return request.get('/api/menu/top-tree-keys', {
    params: {
      roleIds
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request.get('/api/role/tree', {
    params: {
      tenantId
    }
  })
}
