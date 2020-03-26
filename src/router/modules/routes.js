import LoginIndex from '@/page/login/LoginIndex'
import AuthenticatePage from '@/page/Authenticate'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  }, {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }, {
    path: '/login',
    name: 'loginPage',
    component: LoginIndex
  }, {
    path: '/authenticate',
    name: 'authenticatePage',
    component: AuthenticatePage
  }, {
    path: '/exception/403',
    name: '403',
    component: () => import(/* webpackChunkName: "base" */ '@/page/exception/403')
  }, {
    path: '/exception/500',
    name: '500',
    component: () => import(/* webpackChunkName: "base" */ '@/page/exception/500')
  }, {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "base" */ '@/page/exception/404')
  }
]

export default routes
