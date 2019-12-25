import request from '@/rcore-axios'

export const getUsualList = (current, size) => (
  request.get('/api/blade-log/usual/list', { current, size })
)

export const getApiList = (current, size) => (
  request.get('/api/blade-log/api/list', { current, size })
)

export const getErrorList = (current, size) => (
  request.get('/api/blade-log/error/list', { current, size })
)

export const getUsualLogs = (id) => (
  request.get('/api/blade-log/usual/detail/' + id)
)

export const getApiLogs = (id) => (
  request.get('/api/blade-log/api/detail' + id)
)

export const getErrorLogs = (id) => (
  request.get('/api/blade-log/error/detail' + id)
)
