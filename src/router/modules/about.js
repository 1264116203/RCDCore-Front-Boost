const about = [
  {
    path: 'about',
    name: '关于',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }
]
export default about
