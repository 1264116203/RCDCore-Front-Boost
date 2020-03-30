import LoginIndex from '@/page/login/LoginIndex'
import AuthenticatePage from '@/page/Authenticate'

const pages = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  }, {
    path: '/login',
    name: 'loginPage',
    component: LoginIndex
  }, {
    path: '/authenticate',
    name: 'authenticatePage',
    component: AuthenticatePage
  }, {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '@/views/TestPage')
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
