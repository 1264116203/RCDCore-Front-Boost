import noticeAxios from './noticeAxios'
// const store = () => import('@/store')

// const noticeAxios = axios.create({
//   baseURL: 'http://' + website.notificationGatewayHost + '/message',
//   timeout: 10000,
//   headers: { 'Authorization': store.getters.token }
// })

/** 标记消息通知的状态为已完成 */
export const completeNotification = (id) => {
  return noticeAxios.put('/api/complete/' + id)
}

/** 获取当前用户的消息记录数 */
export function getNotificationCount(params) {
  return noticeAxios.get('/api/count', {
    params: {
      ...params
    }
  })
}

/** 标记当前用户已经处理过该消息 */
export const handleNotificationForCurrentUser = (id) => {
  return noticeAxios.put('/api/handle/' + id)
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
  return noticeAxios.put('/api/read/' + id)
}

/** 批量标记消息已读接口 */
/** row是要标记的消息的id集合 */
export const batchReadNotification = (row) => {
  return noticeAxios.put('/api/read/batch', row)
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
export const getDetailsNotification = (id) => {
  return noticeAxios.get('/api/' + id)
}
