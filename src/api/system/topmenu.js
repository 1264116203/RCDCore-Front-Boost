import request from '@/rcore-axios'

export const getList = (page, size, params) => {
  return request.get('/api/top-menu/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const getDetail = (id) => {
  return request.get('/api/top-menu/' + id)
}

export const remove = (ids) => {
  return request.delete('/api/top-menu/batch', { params: { ids } })
}

export const singleRemove = (id) => {
  return request.delete('/api/top-menu/' + id)
}

export const add = (row) => {
  return request.post('/api/top-menu', row)
}

export const update = (row) => {
  return request.put('/api/top-menu', row)
}

/** 顶部菜单树形结构数据 */
export const TopMenulist = () => {
  return request.get('/api/top-menu/list/current-user')
}

/** 根据角色ID获取菜单列表 */
export const byRoleIdMenuIdTree = (roleId) => {
  return request.get('/api/top-menu/list/by-role/' + roleId)
}

export const grant = (authorityIdList, topMenuIdList) => {
  return request.post('/api/top-menu/grant', {
    authorityIdList,
    topMenuIdList
  })
}

/** 获取所有顶部菜单记录 */
export const AllTopMenulist = () => {
  return request.get('/api/top-menu/list')
}
