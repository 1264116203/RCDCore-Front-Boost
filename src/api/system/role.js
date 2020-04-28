import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/role', row)
}

export const removeById = (id) => {
  return request.delete('/api/role/' + id)
}

export const batchRemove = (ids) => {
  return request.delete('/api/role/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return request.put('/api/role', row)
}

export const getById = (id) => {
  return request.get('/api/role/' + id)
}

export const queryWithTree = (params) => {
  return request.get('/api/role/query', {
    params: {
      ...params
    }
  })
}

/** 拉取所有角色组成的角色树 */
export const listAllWithTree = (tenantId) => {
  return request.get('/api/role/tree', {
    params: {
      tenantId
    }
  })
}

/** 给角色授权权限资源 */
export const grant = (authorityIdList, roleIdList) => {
  return request.put('/api/role/grant', {
    authorityIdList,
    roleIdList
  })
}

/** 设置角色对应的顶级菜单 */
export const grantTopMenu = (roleIdList, topMenuIdList) => {
  return request.put('/api/role/top-menu', {
    roleIdList,
    topMenuIdList
  })
}
