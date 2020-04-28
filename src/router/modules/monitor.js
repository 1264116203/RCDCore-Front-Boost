const monitor = [
  {
    path: '/monitor/log/usual',
    name: '通用日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/usual-log-list')
  }, {
    path: '/monitor/log/api',
    name: '接口日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/api-log-list')
  }, {
    path: '/monitor/log/error',
    name: '错误日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/log/error-log-list')
  }
]
export default monitor
