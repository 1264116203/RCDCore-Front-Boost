export default [
  {
    path: '/leave-note',
    name: '消息通知',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "notification" */ '@/views/leave-note/leave-note-list')
  }
]
