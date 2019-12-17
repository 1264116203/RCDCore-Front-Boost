<template>
  <a-menu v-model="selectedKeys" theme="dark" mode="inline"
          :default-selected-keys="selectedKeys"
          @select="menuSelected"
  >
    <a-menu-item key="/main/home">
      <a-icon type="home" />
      <span>首页</span>
    </a-menu-item>
    <my-sub-menu v-for="item in menuList" :key="item.path"
                 :menu-info="item" :default-icon="iconDefault"
    />
  </a-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MySubMenu from '@/page/layout/side-menu/MySubMenu'
import website from '@/config/website'

const iconDefault = website.menu.iconDefault

export default {
  name: 'SideMenu',
  components: { MySubMenu },
  data() {
    return {
      iconDefault
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
  created() {
    this.getMenu().then(data => {

    })
  },
  methods: {
    ...mapActions('user', ['getMenu']),
    ...mapActions('tabs', ['navTo']),
    menuSelected(item) {
      const menuItem = deepSearch(this.menuList, item.key)
      if (!menuItem) {
        this.navTo({
          path: '/main/home',
          meta: {
            isAuth: true,
            isTab: true
          }
        })
      } else {
        this.navTo({
          path: menuItem.path,
          meta: menuItem.meta,
          query: menuItem.query,
          params: menuItem.params
        })
      }
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
