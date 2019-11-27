<template>
  <a-menu theme="dark" mode="inline"
          :default-selected-keys="['4']"
  >
    <a-menu-item key="/main">
      <a-icon type="home" />
      <span>首页</span>
    </a-menu-item>
    <template v-for="item in menuList">
      <a-menu-item v-if="!item.children" :key="item.path">
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
    ...mapGetters(['menuList'])
  },
  created() {
    this.getMenu().then(data => {
      // TODO 添加动态路由
    })
  },
  methods: {
    ...mapActions('user', ['getMenu'])
    // onItemClicked({ item }) {
    //   this.$router.push(item.eventKey)
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
