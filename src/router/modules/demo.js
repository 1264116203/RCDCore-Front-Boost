export default [{
  path: '/demo',
  name: '示例代码页',
  redirect: '/demo/forms'
}, {
  path: '/demo/forms',
  name: '表单示例页',
  meta: {
    isTab: true
  },
  component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/forms')
}, {
  path: '/demo/horizontal-form',
  name: '纵向表单示例页',
  meta: {
    isTab: true
  },
  component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/horizontal-form')
}, {
  path: '/demo/printing',
  name: '打印',
  meta: {
    isTab: true
  },
  component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/printing')
}, {
  path: '/demo/notification/send',
  name: '测试消息发送',
  meta: {
    isTab: true,
    isAuth: true
  },
  component: () => import(/* webpackChunkName: "news" */ '@/page/demo/views/notification-send')
}]
