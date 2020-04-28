const news = [
  {
    path: '/news/notice',
    name: '通知公告',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/notice-table')
  }, {
    path: '/news/send-notice',
    name: '测试消息发送',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/send.vue')
  }
]
export default news
