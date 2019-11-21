<template>
  <a-locale-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      zhCN
    }
  },
  created () {
    if (!window.appShowed) {
      window.showApp()
    }
  }
}
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
