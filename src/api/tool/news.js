import request from '@/rcore-axios'

export const getList = () => {
  return request.get('/api/datasource')
}
