<template>
  <rcd-flow-container>
    <div class="home">
      <img
        alt="Vue logo"
        src="../assets/logo.png"
      >
    </div>
  </rcd-flow-container>
</template>

<script>
// @ is an alias to /src
import RcdFlowContainer from '@/components/basic-container/flow-container'

export default {
  name: 'Home',
  components: {
    RcdFlowContainer
  }
}
</script>

<style scoped lang="less">
  .home {
    img {
      display: block;
      margin: auto;
    }
  }
</style>
