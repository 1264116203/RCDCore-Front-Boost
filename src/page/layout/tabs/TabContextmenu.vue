<template>
  <a-menu mode="vertical" :selectable="false">
    <a-menu-item>
      关闭标签页
    </a-menu-item>
    <a-menu-divider />
    <a-menu-item>
      关闭其他
    </a-menu-item>
    <a-menu-item>
      关闭所有
    </a-menu-item>
  </a-menu>
</template>

<script>

export default {
  name: 'TabContextmenu',
  data() {
    return {}
  },
  computed: {
  }
}
</script>
