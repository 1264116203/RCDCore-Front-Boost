import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './modules/routes'
import about from './modules/about'
import base from './modules/base'
import system from './modules/system'
import monitor from './modules/monitor'
import news from './modules/news'

Vue.use(VueRouter)

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    const mainContentDom = document.getElementById('main-content')
    if (!mainContentDom) {
      return {
        x: 0,
        y: 0
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = mainContentDom.scrollTop
      } else {
        from.meta.savedPosition = 0
      }
      mainContentDom.scrollTop = to.meta.savedPosition
    }
  },
  routes
})

router.addRoutes([{
  path: '/main',
  redirect: '/main/home',
  name: '主框架',
  meta: {
    isTab: false
  },
  component: () => import(/* webpackChunkName: "base" */ '@/page/layout/LayoutIndex'),
  children: [...about, ...base, ...system, ...monitor, ...news]
}])

export default router
