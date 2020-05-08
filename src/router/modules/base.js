const base = [
  {
    path: 'home',
    name: '欢迎页',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/home.vue')
  }, {
    path: '/myiframe/url-path',
    name: 'iframe',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/components/iframe/router-iframe.vue')
  }, {
    path: '/hot-refresh',
    name: '热刷新',
    component: () => import(/* webpackChunkName: "base" */ '@/page/hot-refresh')
  }, {
    path: '/user/info',
    name: '个人信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/user-info/user-info.vue')
  }
]
export default base
