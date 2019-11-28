// 全站权限配置

import router from '@/router'
import store from '@/store'
import { validateNull } from '@/util/validate'
import { getToken } from '@/util/auth'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

// 锁屏页
const lockPage = store.getters.website.lockPage

router.beforeEach((to, from, next) => {
  const meta = Object.assign({ isAuth: false, isTab: false }, (to.meta || {}))

  // 未登录时
  if (!getToken()) {
    // 判断是否需要认证，没有登录访问去登录页
    if (!meta.isAuth) {
      next()
    } else {
      next('/login')
    }
    return
  }

  // 如果登录成功访问登录页跳转到主页
  if (to.path === '/login') {
    next({ path: '/' })
    return
  }

  if (store.getters.isLock && to.path !== lockPage) { // 如果系统激活锁屏，全部跳转到锁屏页
    next({ path: lockPage })
  } else {
    // 如果用户信息为空则获取用户信息失败，跳转到登录页
    if (store.getters.token.length === 0) {
      store.dispatch('user/clearAllAuthInfos').then(() => {
        next({ path: '/login' })
      })
    } else {
      const value = to.query.src || to.fullPath
      const label = to.query.name || to.name
      const meta = to.meta || {}
      // 如果路由meta信息中isTab不为false，则将其加入标签页中
      if (meta.isTab && !validateNull(value) && !validateNull(label)) {
        store.commit('tabs/SWITCH_TAB', {
          label: label,
          path: value,
          params: to.params,
          query: to.query,
          meta: meta,
          group: []
        })
      }
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  if (store.getters.nowTab) {
    let title = store.getters.nowTab.label
    // 根据当前的标签也获取label的值动态设置浏览器标题
    if (title) {
      document.title = store.getters.website.title + ' - ' + title
    } else {
      document.title = store.getters.website.title
    }
  }
})
