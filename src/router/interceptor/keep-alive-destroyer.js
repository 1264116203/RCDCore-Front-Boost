import router from '@/router'
import store from '@/store'
import { componentDestroy } from '@/util/component-destroy-util'

router.afterEach((to, from) => {
  // 当前离开的路由是否在标签列表中
  const isInTabList = store.getters.tabList.find(tab => tab.path === from.path)
  if (from.meta.isTab && !isInTabList) {
    // 移除已失效的路由组件
    componentDestroy()
  }
})
