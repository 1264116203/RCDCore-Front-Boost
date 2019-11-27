<template>
  <a-layout-footer class="view-layout-footer">
    <div>RCDCore-Front-Boost V0.1</div>
    <div>匠心之作，代码典范 &copy;2019</div>
  </a-layout-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="less" scoped>
  @import "../../custom-variables";

  .view-layout-footer {
    text-align: center;
    padding: 1em 0 !important;
    background-color: darken(@layout-body-background, 10%) !important;
  }
</style>
