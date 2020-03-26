const monitor = [
  {
    path: '/monitor/log/usual',
    name: '通用日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/Usual.vue')
  }, {
    path: '/monitor/log/api',
    name: '接口日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/Api.vue')
  }, {
    path: '/monitor/log/error',
    name: '错误日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/Error.vue')
  }
]
export default monitor
