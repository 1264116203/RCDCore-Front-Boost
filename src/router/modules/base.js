const base = [
  {
    path: 'home',
    name: '欢迎页',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/Home.vue')
  }, {
    path: '/myiframe/urlPath',
    name: 'iframe',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/components/iframe/RouterIframe.vue')
  }, {
    path: '/user/info',
    name: '个人信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/userInfo/Info.vue')
  }
]
export default base
