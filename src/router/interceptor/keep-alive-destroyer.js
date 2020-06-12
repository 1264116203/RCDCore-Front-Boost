import router from '@/router'
import store from '@/store'

router.beforeEach(async (to, from, next) => {
  // 判断当前路由是不是属于标签页路由
  const isInTabList = store.getters.tabList.find(tab => tab.path === to.path)
  if (!isInTabList) {
    return next()
  }

  // 只处理组件有名字的情况。没有名字的不管。
  const toName = await getComponentNameFromRoute(to)
  if (toName) {
    const keepAliveComponentNames = store.state.tabs.keepAliveComponentNames
    if (keepAliveComponentNames.indexOf(toName) === -1) {
      store.commit('tabs/UPDATE_KEEP_ALIVE_COMPONENT_NAMES', [...keepAliveComponentNames, toName])
    }
  }
  next()
})

router.afterEach(async (to, from) => {
  // 当前离开的路由是否在标签列表中
  const isInTabList = store.getters.tabList.find(tab => tab.path === from.path)
  if (from.meta.isTab && !isInTabList) {
    // // 移除已失效的路由组件
    // componentDestroy()
    const toName = await getComponentNameFromRoute(from)
    if (toName) {
      const keepAliveComponentNames = [...store.state.tabs.keepAliveComponentNames]
      const index = keepAliveComponentNames.indexOf(toName)
      // 如果列表里有该组件的名字，则将其删除
      if (index !== -1) {
        keepAliveComponentNames.splice(index, 1)
        store.commit('tabs/UPDATE_KEEP_ALIVE_COMPONENT_NAMES', keepAliveComponentNames)
      }
    }
  }
})

function getComponentNameFromRoute(route) {
  return new Promise((resolve, reject) => {
    if (route.matched && route.matched[route.matched.length - 1]) {
      const matched = route.matched[route.matched.length - 1]
      if (matched.components && matched.components.default) {
        // 只处理组件有名字的情况。没有名字的不管。
        const componentInstance = route.matched[route.matched.length - 1].components.default
        if (typeof componentInstance === 'function') {
          componentInstance().then(component => {
            return resolve(component.default.name)
          })
        } else {
          return resolve(componentInstance.name)
        }
      }
    }
  })
}
