import { serialize } from '@/util/util'
import { isUrl } from '@/util/validate'

export const RouteInitializer = {
  install(router, store) {
    router.$enhancer = new RouterEnhancer(router, store)
  }
}

class RouterEnhancer {
  constructor(router, store) {
    this.$website = store.getters.website
    this.$store = store
    this.routerList = []
    this.group = ''
    this.meta = {}

    const propsConfig = this.$website.menu.props
    this.propsDefault = {
      label: propsConfig.label || 'name',
      path: propsConfig.path || 'path',
      icon: propsConfig.icon || 'icon',
      children: propsConfig.children || 'children',
      meta: propsConfig.meta || 'meta'
    }
  }

  setTitle(title) {
    const defaultTitle = this.$website.indexTitle
    title = title ? `${title}-${defaultTitle}` : defaultTitle
    document.title = title
  }

  closeTab(value) {
    let tab = value || this.$store.getters.nowTab
    if (typeof value === 'string') {
      tab = this.$store.getters.tabList.find(ele => ele.value === value)
    }
    this.$store.commit('tabs/CLOSE_TAB', tab)
  }

  /**
   * 根据key生成国际化标题，国际化时使用，暂无需使用
   * @param {string} title 默认标题
   * @param {string} key 国际化key
   * @return {string} 国际化标题
   */
  generateTitle(title, key) {
    if (!key) {
      return title
    }
    return title
  }

  /**
   * 处理路由，如果无src则跳至根路径
   *
   * 如果属于URL，则路由至myiframe组件中
   *
   * @param params {{src: string}}
   * @return {string} 路由结果
   */
  getPath(params) {
    let { src } = params
    let result = src || '/'
    if (isUrl(src)) {
      result = `/myiframe/urlPath?${serialize(params)}`
    }
    return result
  }

  /**
   * 正则路由校验
   *
   * @param regexpList 正则列表
   * @param path 待校验路径
   *
   * @return {boolean} 所有正则符合要求则返回true
   */
  validatePath(path, regexpList) {
    return !regexpList.some(val => new RegExp('^' + val + '.*', 'g').test(path))
  }

  /**
   * 设置路由值
   *
   * @param route
   * @return {*}
   */
  getValue(route) {
    return route.query.src || route.path
  }

  /**
   * 动态路由拼装
   *
   * @param {[]} menuList
   * @param {boolean} first 是否为顶级菜单节点
   * @return {[]|void}
   */
  formatRoutes(menuList = [], first) {
    if (menuList.length === 0) {
      return
    }

    const routeMenuList = []

    function findRouteMenu(menu) {
      const children = menu[this.propsDefault.children]
      if (children && children.length > 0) {
        children.forEach(findRouteMenu)
      } else {
        routeMenuList.push(menu)
      }
    }

    menuList.forEach(findRouteMenu)

    return routeMenuList.map(this.generateRoute)
  }

  generateRoute(menu) {
    const { path: pathProp, name: nameProp, icon: iconProp, meta: metaProp } = this.propsDefault

    // 如果该路径已被加入路由表，则忽略之
    if (this.routerList.includes(menu[pathProp])) {
      return
    }

    let path = menu[pathProp]
    if (!path) {
      path = '/'
    } else if (path[0] !== '/') {
      path = '/' + path
    }
    // 特殊处理组件
    let component = 'views' + path
    let name = menu[nameProp]
    let icon = menu[iconProp]
    let meta = menu[metaProp] || {}

    meta = Object.assign(meta, (function () {
      if (meta.keepAlive === true) {
        return {
          $keepAlive: true
        }
      }
    })())

    return {
      path: path,
      name,
      icon,
      meta,
      component(resolve) {
        require([`../${component}.vue`], resolve)
      }
    }
  }
}
