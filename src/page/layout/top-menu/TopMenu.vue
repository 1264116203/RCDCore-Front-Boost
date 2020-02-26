<template>
  <div>
    <a-menu v-if="showTopMenu" v-model="current" mode="horizontal" @click="onClick">
      <a-menu-item v-for="item in topMenuList" :key="item.id">
        <a-icon :type="item.source" />{{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { listCurrentUserMenuWithTree } from '@/api/system/menu'
import { TopMenulist } from '@/api/system/topmenu'

export default {
  data() {
    return {
      current: ['mail'],
      topMenuList: [],
      showTopMenu: true
    }
  },
  created() {
    TopMenulist().then(res => {
      this.topMenuList = res.data
      if (this.topMenuList.length <= 1) {
        this.showTopMenu = false
      } else {
        this.showTopMenu = true
        let firstId = this.topMenuList[0].id
        this.current.push(firstId)
      }
    })
  },
  methods: {
    onClick(item) {
      listCurrentUserMenuWithTree(item.key).then(res => {
        this.$store.commit('user/SET_MENU_LIST', res.data)
      })
    }
  }
}
</script>
