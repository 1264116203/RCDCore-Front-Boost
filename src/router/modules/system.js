const system = [
  {
    path: '/system/user',
    name: '用户管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-list')
  }, {
    path: '/system/dept',
    name: '部门管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/dept-list')
  }, {
    path: '/system/dict',
    name: '字典管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/dict/dict-list.vue')
  }, {
    path: '/system/menu',
    name: '菜单管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/menu-list')
  }, {
    path: '/system/topmenu',
    name: '顶部菜单',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/top-menu-list')
  }, {
    path: '/system/param',
    name: '参数管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/param-list')
  }, {
    path: '/authority/role',
    name: '角色管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/role-list')
  }
]
export default system
