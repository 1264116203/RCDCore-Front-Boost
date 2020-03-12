<template>
  <a-spin :spinning="isLoading" class="news-list">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <div>
          <a-tag color="pink">
            {{ item.state }}
          </a-tag>
        </div>
        <a-list-item-meta
          :description="item.content"
        >
          <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-spin>
</template>
<script>
import { getList } from '@/api/tool/news'

export default {
  data() {
    return {
      data: [],
      isLoading: false
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 列表数据 */
    fetchTableData () {
      this.isLoading = true
      getList()
        .then(res => {
          this.data = res.data
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    }
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
