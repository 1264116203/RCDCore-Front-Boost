import store from '@/store'
import Vue from 'vue'

export default function defaultHandler(notification) {
  // 默认行为，关闭通知对话框
  store.commit('notification/SET_MODAL_VISIBLE', false)
}

export function handleDemoMessage(notification) {
  Vue.prototype.$message.info(`id = ${notification.id}, 该消息已被处理。`)
  defaultHandler(notification)
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
  defaultHandler(notification)
}
