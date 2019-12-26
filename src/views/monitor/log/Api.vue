<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="服务id">
        <a-input v-model="searchInfo.serviceId" placeholder="服务id" />
      </a-form-item>
      <a-form-item label="服务host">
        <a-input v-model="searchInfo.serverHost" placeholder="服务host" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSearch">
          搜索
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="clearSearch">
          清空
        </a-button>
      </a-form-item>
    </a-form>

    <a-table
      bordered
      row-key="id"
      :pagination="pagination"
      :columns="columns"
      :data-source="tableDataList"
      @change="handleTableChange"
    >
      <template #operation="text, record">
        <div class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" />查看
          </a>
        </div>
      </template>
    </a-table>

    <api-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  getApiList
} from '@/api/logs'
import ApiEdit from './ApiEdit.vue'
import { LogMainMixin } from '@/components/mixins/monitor/LogMainMixin'

const columns = [
  {
    title: '服务id',
    dataIndex: 'serviceId'
  },
  {
    title: '服务host',
    dataIndex: 'serverHost'
  },
  {
    title: '服务ip',
    dataIndex: 'serverIp'
  },
  {
    title: '软件环境',
    dataIndex: 'env'
  },
  {
    title: '日志名',
    dataIndex: 'title'
  },
  {
    title: '请求方法',
    dataIndex: 'method'
  },
  {
    title: '请求接口',
    dataIndex: 'requestUri'
  },
  {
    title: '日志时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    ApiEdit
  },
  mixins: [LogMainMixin],
  data () {
    return {
      columns
    }
  },
  created () {
    this.fetchTableData(getApiList)
  }
}
</script>

<style scoped>
.warp{
  margin: 20px;
}
.warp .operation-btn .editable-add-btn{
  margin-right: 20px;
}
.editable-row-operations a {
  margin-right: 8px;
}

.warp .ant-table-wrapper{
  margin: 20px 0;
}
</style>
