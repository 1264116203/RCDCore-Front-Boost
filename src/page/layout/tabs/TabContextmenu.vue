<template>
  <a-menu v-show="contextmenuShowing"
          prefix-cls="ant-dropdown-menu"
          class="absolute"
          :selectable="false"
          :style="styleObj"
  >
    <a-menu-item>
      关闭其他
    </a-menu-item>
    <a-menu-item>
      关闭所有
    </a-menu-item>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TabContextmenu',
  data() {
    return {}
  },
  computed: {
    ...mapState('tabs', ['contextmenuShowing', 'contextmenuPosition']),
    styleObj() {
      return {
        left: this.contextmenuPosition.x + 'px',
        top: this.contextmenuPosition.y + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .absolute {
    position: absolute;
  }
</style>
