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
    name: '部门管理',
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
    path: '/system/topmenu',
    name: '顶部菜单',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/system/TopMenu.vue')
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
    path: '/authority/role',
    name: '角色管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/authority/Role.vue')
  },
  {
    path: '/monitor/log/usual',
    name: '通用日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/monitor/log/Usual.vue')
  },
  {
    path: '/monitor/log/api',
    name: '接口日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/monitor/log/Api.vue')
  },
  {
    path: '/monitor/log/error',
    name: '错误日志',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/monitor/log/Error.vue')
  }
  ]
}])

export default router
