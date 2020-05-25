import store from '@/store'
import Vue from 'vue'

export default async function defaultHandler(notification) {
  // 默认行为，关闭通知对话框
  store.commit('notification/SET_MODAL_VISIBLE', false)
  // 查看详情关闭后标记已读
  await store.dispatch('notification/readNotification', notification.id)
  // 刷新已读
  await store.dispatch('notification/getCount')
}

export async function handleDemoMessage(notification) {
  Vue.prototype.$message.info(`id = ${notification.id}, 该消息已被处理。`)
  await defaultHandler(notification)
}

export async function handleDemoCmdMessage(notification) {
  // 跳转至角色管理页面
  await store.dispatch('tabs/navTo', {
    path: '/authority/role',
    name: '角色管理',
    meta: {
      isAuth: true,
      isTab: true
    }
  })
  await defaultHandler(notification)
}
