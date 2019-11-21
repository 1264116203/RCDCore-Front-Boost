import request from '@/rcore-axios'
import { baseUrl } from '@/config/env'

export const login = (tenantId, username, password, type) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    username,
    password,
    grant_type: 'password',
    scope: 'all',
    type
  }
})

export const refreshToken = (refreshToken, tenantId) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'all'
  }
})

export const getButtons = () => request({
  url: '/api/blade-system/menu/buttons',
  method: 'get'
})

export const getUserInfo = () => request({
  url: baseUrl + '/user/getUserInfo',
  method: 'get'
})

export const sendLogs = (list) => request({
  url: baseUrl + '/user/logout',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: baseUrl + '/user/logout',
  method: 'get'
})
