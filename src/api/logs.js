import request from '@/rcore-axios'

export const getUsualList = (current, size, params) => (
  request.get('/api/log-usual/pagination', { params: { page: current, size, ...params } })
)

export const getApiList = (current, size, params) => (
  request.get('/api/log-api/pagination', { params: { page: current, size, ...params } })
)

export const getErrorList = (current, size, params) => (
  request.get('/api/log-error/pagination', { params: { page: current, size, ...params } })
)

export const getUsualLogs = (id) => (
  request.get('/api/log-usual/' + id)
)

export const getApiLogs = (id) => (
  request.get('/api/log-api/' + id)
)

export const getErrorLogs = (id) => (
  request.get('/api/log-error/' + id)
)
