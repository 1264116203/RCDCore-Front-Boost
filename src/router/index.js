import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  // TODO 行为不对，后需改掉
  scrollBehavior(to, from, savedPosition) {
    const avueView = document.getElementById('avue-view')
    if (!avueView) {
      return {
        x: 0,
        y: 0
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = avueView.scrollTop
      } else {
        from.meta.savedPosition = 0
      }
      avueView.scrollTop = to.meta.savedPosition
    }
  },
  routes
})

export default router
