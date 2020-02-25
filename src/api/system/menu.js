import axios from '@/rcore-axios'

export const add = (row) => {
  return axios.post('/api/authority', row)
}

export const deleteById = (id) => {
  return axios.delete('/api/authority/' + id)
}

export const batchDelete = (ids) => {
  return axios.delete('/api/authority/batch', {
    params: {
      ids
    }
  })
}

export const update = (row) => {
  return axios.post('/api/authority', row)
}

export const getById = (id) => {
  return axios.get('/api/authority/' + id)
}

export const queryListWithTree = (params) => {
  return axios.get('/api/authority/query', {
    params: {
      ...params
    }
  })
}

export const listWithTree = () => {
  return axios.get('/api/authority/menu-tree')
}

export const getTopMenu = () => {
  return axios.get('/api/authority/top-menu')
}

export const listCurrentUserMenuWithTree = (topMenuId) => {
  return axios.get('/api/authority/current-user/menu-tree', {
    params: {
      topMenuId
    }
  })
}

export const byRoleIdMenuWithTree = (roleId) => {
  return axios.get('/api/authority/tree/by-role/' + roleId)
}
