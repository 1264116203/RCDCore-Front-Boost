<template>
  <div class="basic-container">
    <a-card>
      <slot />
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer'
}
</script>

<style lang="less">
.basic-container {
  padding: 10px 6px;
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>
