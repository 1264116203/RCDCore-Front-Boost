import request from '@/rcore-axios'

export const getUsualList = (current, size, params) => (
  request.get('/api/logUsual/pagination', { params: { current, size, ...params } })
)

export const getApiList = (current, size, params) => (
  request.get('/api/logApi/pagination', { params: { current, size, ...params } })
)

export const getErrorList = (current, size, params) => (
  request.get('/api/logError/pagination', { params: { current, size, ...params } })
)

export const getUsualLogs = (id) => (
  request.get('/api/logUsual/' + id)
)

export const getApiLogs = (id) => (
  request.get('/api/logApi/' + id)
)

export const getErrorLogs = (id) => (
  request.get('/api/logError/' + id)
)
