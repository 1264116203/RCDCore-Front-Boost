<template>
  <a-menu theme="dark" mode="inline"
          :default-selected-keys="['4']"
  >
    <template v-for="item in menuList">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon type="pie-chart" />
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SideMenu',
  computed: {
    ...mapGetters(['menuList'])
  },
  created() {
    this.getMenu.then(data => {
      // TODO 添加动态路由
    })
  },
  methods: {
    ...mapActions('user', ['getMenu'])
  }
}
</script>

<style lang="less" scoped>

</style>
