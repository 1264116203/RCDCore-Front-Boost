import LoginIndex from '@/page/login/login-index'
import AuthenticatePage from '@/page/authenticate'

const pages = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  }, {
    path: '/login',
    name: '登录页',
    component: LoginIndex
  }, {
    path: '/authenticate',
    name: '权限鉴定页',
    component: AuthenticatePage
  }, {
    path: '/test',
    name: '测试页',
    component: () => import(/* webpackChunkName: "test" */ '@/views/test-page')
  }, {
    path: '/exception/403',
    name: '403',
    component: () => import(/* webpackChunkName: "base" */ '@/page/exception/403')
  }, {
    path: '/exception/500',
    name: '500',
    component: () => import(/* webpackChunkName: "base" */ '@/page/exception/500')
  }
]

export default pages
