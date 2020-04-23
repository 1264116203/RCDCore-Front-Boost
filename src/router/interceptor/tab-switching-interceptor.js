/**
 * 专门处理路由-tab切换的拦截器
 */
import router from '@/router'
import NProgress from 'nprogress'
import store from '@/store'
import { validateNull } from '@/util/validate'

router.beforeEach((to, from, next) => {
  const meta = Object.assign({ isAuth: false, isTab: false }, (to.meta || {}))

  let path = ''
  // 针对iframe组件的特殊处理
  if (to.name === 'iframe') {
    path = to.query.src
  } else {
    path = to.fullPath
  }

  // 在菜单列表里找不到，再查tabList
  store.dispatch('tabs/getTabItem', {
    path,
    query: to.query,
    params: to.params
  })
    .then(() => {
      store.commit('tabs/SWITCH_TAB', {
        path,
        params: to.params,
        query: to.query
      })
    })
    .catch(() => {
      store.dispatch('user/getMenuItemByPath', path)
        // 如果能在左侧菜单列表中拿到，则说明该页面是个标签页，则将其加入标签页列表中
        .then((menuItem) => {
          if (!validateNull(path)) {
            store.commit('tabs/SWITCH_TAB', {
              path,
              params: to.params,
              query: to.query,
              label: menuItem.name,
              meta: {
                ...meta,
                isIframe: path.indexOf('http') === 0
              },
              group: []
            })
          }
        })
        .catch(() => {
          if (to.meta && to.meta.isTab) {
            store.commit('tabs/SWITCH_TAB', {
              path,
              params: to.params,
              query: to.query,
              label: to.name,
              meta: {
                ...meta,
                isIframe: path.indexOf('http') === 0
              },
              group: []
            })
          }
        })
    })
    .finally(() => {
      store.commit('sidemenu/UPDATE_MENU_PATH', path)
      next()
    })
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
