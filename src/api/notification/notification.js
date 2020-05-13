import notificationAxios from './notification-axios'

/** 标记消息通知的状态为已完成 */
export const completeNotification = (id) => {
  return notificationAxios.put('/api/complete/' + id)
}

/** 获取当前用户的消息记录数 */
export function getNotificationCount(params) {
  return notificationAxios.get('/api/count', {
    params: {
      ...params
    }
  })
}

/** 标记当前用户已经处理过该消息 */
export const handleNotificationForCurrentUser = (id) => {
  return notificationAxios.put('/api/handle/' + id)
}

/** 分页拉取消息数据 */
export const listWithPagination = (page, size, params) => {
  return notificationAxios.get('/api/pagination', {
    params: {
      ...params,
      page,
      size
    }
  })
}

/** 消息通知本体阅读 */
export const readNotification = (id) => {
  return notificationAxios.put('/api/read/' + id)
}

/** 批量标记消息已读接口 */
/** row是要标记的消息的id集合 */
export const batchReadNotification = (row) => {
  return notificationAxios.put('/api/read/batch', row)
}

/** 通知接收状态查询 */
export const receivingStatus = (id) => {
  return notificationAxios.get('/api/receivingStatus/' + id)
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
  return notificationAxios.post('/api/send', row)
}

/** 获取消息通知完整详情 */
export const getDetailsNotification = (id) => {
  return notificationAxios.get('/api/' + id)
}
