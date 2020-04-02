import axios from 'axios'
import website from '@/config/website'

const baseUrl = 'http://' + website.notificationGatewayHost + '/message'

export const completeNotification = (id) => {
  return axios.put(baseUrl + '/api/complete/' + id)
}

export const handleNotificationForCurrentUser = (id) => {
  return axios.put(baseUrl + '/api/handle/' + id)
}

export const listCurrentUsersNotification = (params = {}) => {
  return axios.get(baseUrl + '/api/list', {
    params: {
      ...params
    }
  })
}

export const listWithPagination = (page, size, params) => {
  return axios.get(baseUrl + '/api/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

export const readNotification = (id) => {
  return axios.get(baseUrl + '/api/read/' + id)
}

export const receivingStatus = (id) => {
  return axios.get(baseUrl + '/api/receivingStatus/' + id)
}

export const sendNotification = (row) => {
  return axios.post(baseUrl + '/api/send', row)
}

export const getAllNotification = (id) => {
  return axios.get(baseUrl + '/api/' + id)
}
