import request from '@/rcore-axios'

export const getList = (params) => {
  return request.get('/api/role/query', {
    params: {
      ...params
    }
  })
}

export const grant = (authorityIdList, roleIdList) => {
  return request.post('/api/role/grant', {
    authorityIdList,
    roleIdList
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
  return request.post('/api/role', row)
}

export const update = (row) => {
  return request.put('/api/role', row)
}

export const getRoleTree = (tenantId) => {
  return request.get('/api/role/tree', {
    params: {
      tenantId
    }
  })
}

/** 设置角色对应的顶级菜单 */
export const setTopMenuGrant = (roleIdList, topMenuIdList) => {
  return request.put('/api/role/top-menu', {
    roleIdList,
    topMenuIdList
  })
}
