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

    <error-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  getErrorList
} from '@/api/logs'
import ErrorEdit from './error-log-edit'
import { MainMixin } from '@/components/mixins/monitor/main-mixin'
import moment from 'moment'

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
    ErrorEdit
  },
  mixins: [MainMixin],
  data () {
    return {
      columns,
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      },
      /** 页面是否加载 */
      isLoading: false
    }
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      getErrorList(this.pagination.current - 1, this.pagination.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
          this.pagination.total = res.data.totalElements
          /** 转换为时间格式 */
          this.tableDataList.map(item => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    }
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
