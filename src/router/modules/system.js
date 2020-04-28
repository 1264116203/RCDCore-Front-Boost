const system = [
  {
    path: '/system/user',
    name: '用户管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/User.vue')
  }, {
    path: '/system/dept',
    name: '部门管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/Dept.vue')
  }, {
    path: '/system/dict',
    name: '字典管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/dict/Dict.vue')
  }, {
    path: '/system/menu',
    name: '菜单管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/Menu.vue')
  }, {
    path: '/system/topmenu',
    name: '顶部菜单',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/TopMenu.vue')
  }, {
    path: '/system/param',
    name: '参数管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/Param.vue')
  }, {
    path: '/authority/role',
    name: '角色管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/Role.vue')
  }
]
export default system
