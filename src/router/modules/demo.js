export default [{
  path: '/demo',
  name: '示例代码页',
  meta: {
    isTab: false,
    isAuth: false
  },
  component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/demo-index'),
  children: [{
    path: 'forms',
    name: '表单示例页',
    component: () => import(/* webpackChunkName: "demo" */ '@/page/demo/views/forms')
  }]
}]
