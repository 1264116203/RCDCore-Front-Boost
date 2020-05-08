<script>
export default {
  name: 'HotRefresh',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace(from.path)
    })
  },
  render() {
    return (<a-spin />)
  }
}
</script>

<style lang="less" scoped>

</style>
