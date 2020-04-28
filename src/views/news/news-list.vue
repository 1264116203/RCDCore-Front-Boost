<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.description"
        >
          <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
      </a-list-item>
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
  }
}
</script>
<style lang="less">
  .news-list {
    .ant-list-item {
      padding: 12px;
    }
  }
</style>
