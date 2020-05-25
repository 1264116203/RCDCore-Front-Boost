<template>
  <a-dropdown placement="bottomRight">
    <a-button type="link" class="right-button" icon="bug" />
    <a-menu slot="overlay">
      <a-menu-item>
        <router-link to="/demo/forms">
          表单示例
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="/demo/horizontal-form">
          纵向表单示例
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="/demo/notification/send">
          消息发送示例
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="/demo/printing">
          打印示例
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'DemoMenu'
}
</script>

<style lang="less" scoped>

</style>
