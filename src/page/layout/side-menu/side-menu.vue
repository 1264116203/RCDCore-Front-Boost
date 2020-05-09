<template>
  <a-menu v-model="selectedKeys" theme="dark" mode="inline"
          :default-selected-keys="selectedKeys"
          :open-keys="openKeys"
          @click="menuSelected"
          @openChange="onOpenChange"
  >
    <a-menu-item v-show="!isLoading" key="/main/home">
      <a-icon type="home" />
      <span>首页</span>
    </a-menu-item>
    <template v-for="item in menuList">
      <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.path">
        <a-icon :type="item.icon ? item.icon : iconDefault" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <my-sub-menu v-else :key="item.path" :menu-info="item" :default-icon="iconDefault" />
    </template>
  </a-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MySubMenu from '@/page/layout/side-menu/my-sub-menu'
import website from '@/config/website'
import { tabDiff } from '@/util/tabs-util'
import router from '@/router'

const iconDefault = website.menu.iconDefault

export default {
  name: 'SideMenu',
  components: { MySubMenu },
  data() {
    return {
      isLoading: false,
      iconDefault,
      openKeys: []
    }
  },
  computed: {
    ...mapGetters(['menuList']),
    selectedKeys: {
      get() {
        return this.$store.state.sidemenu.selectedKeys
      },
      set(val) {
        this.$store.commit('sidemenu/UPDATE_SELECTED_KEYS', val)
      }
    }
  },
  watch: {
    menuList: function () {
      this.openKeys = this.menuList.filter(item => item.isDefaultExpanded).map(item => item.path)
    }
  },
  created() {
    this.isLoading = true
    this.getMenu()
      .finally(() => {
        this.isLoading = false
      })
  },
  methods: {
    ...mapActions('user', ['getMenu']),
    ...mapActions('tabs', ['navTo']),
    menuSelected(item) {
      const menuItem = deepSearch(this.menuList, item.key)
      if (menuItem.isOpen) {
        if (menuItem.path.indexOf('http') === 0) {
          window.open(menuItem.path)
          return
        }
        let path = window.location.href.substring(0, window.location.href.indexOf('#'))
        window.open(path + '#' + menuItem.path)
        return
      }
      let tabElem
      if (!menuItem) {
        tabElem = {
          path: '/main/home',
          name: '首页',
          meta: {
            isAuth: true,
            isTab: true
          }
        }
      } else {
        if (menuItem.path.indexOf('http') === 0) {
          tabElem = {
            path: '/myiframe/url-path',
            name: menuItem.name,
            query: {
              tabName: menuItem.name,
              src: menuItem.path
            }
          }
        } else {
          tabElem = {
            path: menuItem.path,
            name: menuItem.name
          }
        }
      }
      // 如果待切换Tab和当前Tab是同一个，则刷新
      if (tabDiff(this.$store.getters['tabs/activeTab'], tabElem)) {
        const component = router.currentRoute.matched[router.currentRoute.matched.length - 1].instances['default']
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
              console.log(`正在刷新路由组件，key：${key}`)
              cache[key].componentInstance.$destroy()
              delete cache[key]
            }
          }
        }
        router.replace('/hot-refresh')
      } else {
        this.navTo(tabElem)
      }
    },
    onOpenChange(val) {
      this.openKeys = val
    }
  }
}

function deepSearch(list, key) {
  const found = list.find(val => val.path === key)
  if (!found) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children) {
        let result = deepSearch(list[i].children, key)
        if (result) {
          return result
        }
      }
    }
  }
  return found
}
</script>

<style lang="less" scoped>

</style>
