const news = [
  {
    path: '/news/NoticeTable',
    name: '公告',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/NoticeTable.vue')
  }, {
    path: '/news/sendNotice',
    name: '测试消息发送',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/send.vue')
  }
]
export default news
