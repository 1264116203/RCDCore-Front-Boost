import router from '@/router'
import store from '@/store'

router.afterEach((to, from) => {
  // 当前离开的路由是否在标签列表中
  const isInTabList = store.getters.tabList.find(tab => tab.path === from.path)
  if (from.meta.isTab && !isInTabList) {
    const component = from.matched[from.matched.length - 1].instances['default']

    if (component && component.$vnode && component.$vnode.parent && component.$vnode.parent.componentInstance &&
      component.$vnode.parent.componentInstance.cache) {
      if (component.$vnode.componentOptions) {
        const key = component.$vnode.key == null
          ? component.$vnode.componentOptions.Ctor.cid +
            (component.$vnode.componentOptions.tag ? `::${component.$vnode.componentOptions.tag}` : '')
          : component.$vnode.key
        const cache = component.$vnode.parent.componentInstance.cache
        const keys = component.$vnode.parent.componentInstance.keys
        if (cache[key]) {
          if (keys.length) {
            const index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          console.log(`正在移除已失效路由组件，key：${key}`)
          cache[key].componentInstance.$destroy()
          delete cache[key]
        }
      }
    }
  }
})
