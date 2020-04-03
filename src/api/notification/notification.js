import axios from 'axios'
import website from '@/config/website'

const noticeAxios = axios.create({
  baseURL: 'http://' + website.notificationGatewayHost + '/message',
  timeout: 10000,
  headers: { 'Authorization': 'abc' }
})

/** 标记消息通知的状态为已完成 */
export const completeNotification = (id) => {
  return noticeAxios.put('/api/complete/' + id)
}

/** 标记当前用户已经处理过该消息 */
export const handleNotificationForCurrentUser = (id) => {
  return noticeAxios.put('/api/handle/' + id)
}

/** 拉取当前用户某时间段内的消息数据 */
export const listCurrentUsersNotification = ({ timeEnd, timeStart, type } = {}) => {
  return noticeAxios.get('/api/list', {
    params: {
      timeEnd,
      timeStart,
      type
    }
  })
}

/** 分页拉取消息数据 */
export const listWithPagination = (page, size, params) => {
  return noticeAxios.get('/api/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

/** 消息通知本体阅读 */
export const readNotification = (id) => {
  return noticeAxios.get('/api/read/' + id)
}

/** 通知接收状态查询 */
export const receivingStatus = (id) => {
  return noticeAxios.get('/api/receivingStatus/' + id)
}

/** 通知消息发送 */
/**
 * 请求示例
 *
{
"detailLink": "",
"payload": "",
"receivers": [],
"summary": "",
"title": "",
"type": ""
}
 */
export const sendNotification = (row) => {
  return noticeAxios.post('/api/send', row)
}

/** 获取消息通知完整详情 */
export const getAllNotification = (id) => {
  return noticeAxios.get('/api/' + id)
}
