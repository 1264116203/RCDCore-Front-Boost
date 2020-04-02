<template>
  <div class="news-warp">
    <h3>通知</h3>
    <a-divider />
    <a-card
      style="width:100%"
      :bordered="false"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <p v-if="noTitleKey === 'article'">
        article content
      </p>
      <p v-else-if="noTitleKey === 'app'">
        app content
      </p>
      <p v-else>
        project content
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabListNoTitle: [
        {
          key: 'article',
          tab: '已读'
        },
        {
          key: 'app',
          tab: '未读'
        },
        {
          key: 'project',
          tab: '全部数据'
        }
      ],
      key: 'tab1',
      noTitleKey: 'app'
    }
  },
  methods: {
    onTabChange(key, type) {
      this[type] = key
    }
  }
}
</script>

<style scoped lang="less">
.news-warp{
    padding: 24px 32px;
}
</style>
