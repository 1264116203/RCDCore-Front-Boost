const news = [
  {
    path: '/news/notice',
    name: '通知公告',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/notice-table')
  }
]
export default news
