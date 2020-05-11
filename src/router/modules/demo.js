export default [{
  path: '/demo',
  name: '示例代码页',
  redirect: '/demo/forms',
  meta: {
    isTab: false,
    isAuth: false
  },
  component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/demo-index'),
  children: [{
    path: 'forms',
    name: '表单示例页',
    component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/forms')
  }, {
    path: 'horizontal-form',
    name: '纵向表单示例页',
    component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/horizontal-form')
  }, {
    path: 'printing',
    name: '打印',
    component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/printing')
  }, {
    path: 'notification/send',
    name: '测试消息发送',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "news" */ '@/page/demo/views/notification-send')
  }]
}]
