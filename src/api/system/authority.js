import axios from '@/rcore-axios'

export const add = (row) => {
  return axios.post('/api/authority', row)
}

export const removeById = (id) => {
  return axios.delete('/api/authority/' + id)
}

export const batchRemove = (ids) => {
  return axios.delete('/api/authority/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return axios.put('/api/authority', row)
}

export const getById = (id) => {
  return axios.get('/api/authority/' + id)
}

/** CRUD树形结构查询接口 */
export const queryWithTree = (params) => {
  return axios.get('/api/authority/query', {
    params: {
      ...params
    }
  })
}

/** 顶部菜单设置权限的全部菜单树形结构数据 */
export const listAllMenuWithTree = () => {
  return axios.get('/api/authority/menu-tree')
}

/** 全菜单树形结构数据 */
export const listAllWithTree = () => {
  return axios.get('/api/authority/tree')
}

/** 当前登录用户的菜单列表数据 */
export const listCurrentUserMenuWithTree = (topMenuId) => {
  return axios.get('/api/authority/current-user/menu-tree', {
    params: {
      topMenuId
    }
  })
}

/** 根据角色ID对应的树形结构数据 */
export const listMenuByRoleIdWithTree = (roleId) => {
  return axios.get('/api/authority/tree/by-role/' + roleId)
}

/** 根据顶级菜单ID对应的树形结构数据 */
export const listMenuByTopMenuIdWithTree = (topMenuId) => {
  return axios.get('/api/authority/menu-tree/by-top-menu/' + topMenuId)
}
