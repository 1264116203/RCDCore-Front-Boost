import request from '@/rcore-axios'

export const add = (row) => {
  return request.post('/api/top-menu', row)
}

export const batchRemove = (ids) => {
  return request.delete('/api/top-menu/batch', { params: { ids } })
}

export const singleRemove = (id) => {
  return request.delete('/api/top-menu/' + id)
}

export const update = (row) => {
  return request.put('/api/top-menu', row)
}

export const getById = (id) => {
  return request.get('/api/top-menu/' + id)
}

export const listWithPagination = (page, size, params) => {
  return request.get('/api/top-menu/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

/** 顶部菜单树形结构数据 */
export const listForCurrent = () => {
  return request.get('/api/top-menu/list/current-user')
}

/** 根据角色ID获取菜单列表 */
export const listByRoleId = (roleId) => {
  return request.get('/api/top-menu/list/by-role/' + roleId)
}

/** 给顶部菜单授权权限资源 */
export const grant = (authorityIdList, topMenuIdList) => {
  return request.put('/api/top-menu/grant', {
    authorityIdList,
    topMenuIdList
  })
}

/** 获取所有顶部菜单记录 */
export const listAll = () => {
  return request.get('/api/top-menu/list')
}
