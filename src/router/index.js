import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginIndex from '@/page/login/LoginIndex'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'loginPage',
    component: LoginIndex
  }
]

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
  children: [{
    path: 'about',
    name: '关于',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }, {
    path: 'home',
    name: '欢迎页',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue')
  },
  {
    path: '/system/user',
    name: '用户管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/User.vue')
  },
  {
    path: '/system/dept',
    name: '机构管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/Dept.vue')
  },
  {
    path: '/system/dict',
    name: '字典管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/Dict.vue')
  },
  {
    path: '/system/menu',
    name: '菜单管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/Menu.vue')
  },
  {
    path: '/system/param',
    name: '参数管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/Param.vue')
  },
  {
    path: '/system/client',
    name: '应用管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/Client.vue')
  }
  ]
}])

export default router
