import router from '@/router'
import store from '@/store'
import { validateNull } from '@/util/validate'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  const meta = Object.assign({ isAuth: false, isTab: false }, (to.meta || {}))

  const authenticated = store.getters.authenticated

  // 无需鉴权的页面直接放行
  if (!to.meta.isAuth) {
    if (to.path === '/login') {
      if (authenticated === 'yes') {
        next({ path: '/' })
        return
      }
    }
    next()
    return
  }

  // 如果尚未鉴定权限且目标路由需要权限，则跳转至鉴权页面
  if (authenticated === 'not-yet') {
    store.commit('user/SET_LAST_PAGE_BEFORE_LOGIN', to)
    next({
      path: '/authenticate'
    })
    return
  }
  // 如果权限鉴定失败，则跳转至登录页
  if (authenticated === 'no') {
    next('/login')
    return
  }

  const value = to.query.src || to.fullPath
  const label = to.query.tabName || to.name
  // 如果路由meta信息中isTab不为false，则将其加入标签页中
  if (meta.isTab && !validateNull(value) && !validateNull(label)) {
    store.commit('tabs/SWITCH_TAB', {
      label: label,
      path: value,
      params: to.params,
      query: to.query,
      meta: {
        ...meta,
        isIframe: value.indexOf('http') === 0
      },
      group: []
    })
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
  if (to.meta.isTab) {
    if (store.getters.nowTab) {
      let title = store.getters.nowTab.label
      // 根据当前的标签也获取label的值动态设置浏览器标题
      if (title) {
        document.title = store.getters.website.title + ' - ' + title
      } else {
        document.title = store.getters.website.title
      }
    }
  }
})
