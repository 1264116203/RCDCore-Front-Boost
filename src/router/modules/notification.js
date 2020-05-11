const notification = [
  {
    path: '/news/notice',
    name: '消息通知',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "notification" */ '@/views/notification/notice-table')
  }
]
export default notification
