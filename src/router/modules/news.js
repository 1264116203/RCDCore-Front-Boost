const news = [
  {
    path: '/news/notice',
    name: '公告',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/notice.vue')
  }
]
export default news
