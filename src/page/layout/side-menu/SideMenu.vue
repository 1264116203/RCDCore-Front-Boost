<template>
  <a-menu v-model="selectedKeys" theme="dark" mode="inline"
          :default-selected-keys="selectedKeys"
          @select="menuSelected"
  >
    <!-- <a-menu-item key="/main/home">
      <a-icon type="home" />
      <span>首页</span>
    </a-menu-item>-->
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
          name: '首页'
        })
      } else {
        if (menuItem.path.indexOf('http') === 0) {
          this.navTo({
            path: '/myiframe/urlPath',
            name: menuItem.name,
            query: {
              tabName: menuItem.name,
              src: menuItem.path
            }
          })
        } else {
          this.navTo({
            path: menuItem.path,
            name: menuItem.name
          })
        }
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
