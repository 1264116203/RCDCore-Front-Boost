<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" />
    </a-list>
  </a-spin>
</template>
<script>

export default {
  data() {
    return {
      data: [],
      isLoading: false
    }
  },
  methods: {
    /** 列表数据 */
  }
}
</script>
<style lang="less">
.news-list{
  .ant-list-item{
  padding: 12px;
  }
}
</style>
