import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
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

  next()
})
