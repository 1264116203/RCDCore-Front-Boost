import request from '@/rcore-axios'

export const listUsualLogWithPagination = (current, size, params) => (
  request.get('/api/log-usual/pagination', { params: { page: current, size, ...params } })
)

export const listApiLogWithPagination = (current, size, params) => (
  request.get('/api/log-api/pagination', { params: { page: current, size, ...params } })
)

export const listErrorLogWithPagination = (current, size, params) => (
  request.get('/api/log-error/pagination', { params: { page: current, size, ...params } })
)

export const getUsualLogById = (id) => (
  request.get('/api/log-usual/' + id)
)

export const getApiLogById = (id) => (
  request.get('/api/log-api/' + id)
)

export const getErrorLogById = (id) => (
  request.get('/api/log-error/' + id)
)
