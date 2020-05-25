import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './modules/pages'
import base from './modules/base'
import system from './modules/system'
import monitor from './modules/monitor'
import notification from './modules/notification'
import demos from './modules/demo'

Vue.use(VueRouter)

/** 页面级总路由表 */
const routes = []
/** 框架内子路由表 */
const layoutChildrenRoutes = []

// 添加自定义路由模块（新添加的模块每个模块一行）
layoutChildrenRoutes.push(...base)
layoutChildrenRoutes.push(...system)
layoutChildrenRoutes.push(...monitor)
layoutChildrenRoutes.push(...notification)
layoutChildrenRoutes.push(...demos)

// 添加主框架页面到总路由表
routes.push({
  path: '/main',
  redirect: '/main/home',
  name: '主框架',
  meta: {
    isTab: false
  },
  component: () => import(/* webpackChunkName: "base" */ '@/page/layout/layout-index'),
  children: layoutChildrenRoutes
})
// 添加其他页面到总路由表
routes.push(...pages)
// 将该匹配放到最后，使不存在路由导航至404
routes.push({
  path: '*',
  name: '404',
  component: () => import(/* webpackChunkName: "base" */ '@/page/exception/404')
})

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

export default router
