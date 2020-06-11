<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="参数名称">
        <a-input v-model="searchInfo.paramName" placeholder="参数名称" />
      </a-form-item>
      <a-form-item label="参数键名">
        <a-input v-model="searchInfo.paramKey" placeholder="参数键名" />
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

    <div class="operation-btn">
      <a-button class="editable-add-btn" type="primary" @click="handleAdd">
        添加
      </a-button>
      <a-button class="editable-add-btn" type="danger" @click="handleBatchDelete">
        批量删除
      </a-button>
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :data-source="tableDataList"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :pagination="false"
    >
      <template #operation="text, record">
        <div class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" />查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" />修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="onDeleteRecord(record.id)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>

    <param-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/system/param'
import { ACTION_TYPE } from '@/config/env'
import ParamEdit from './param-edit'
import { myMixin } from '@/components/mixins/main-mixin'

const columns = [
  {
    title: '参数名称',
    dataIndex: 'paramName'
  },
  {
    title: '参数键名',
    dataIndex: 'paramKey'
  },
  {
    title: '参数键值',
    dataIndex: 'paramValue'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'ParamList',
  components: {
    ParamEdit
  },
  mixins: [myMixin],
  data () {
    return {
      /** 搜索的条件  参数名称 参数键名 */
      searchInfo: {
        paramName: '',
        paramKey: ''
      },
      columns,
      current: 1,
      pageSize: 10
    }
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      listWithPagination(this.current - 1, this.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    openCreateModal() {
      this.$refs.modal.open(ACTION_TYPE.CREATION)
    },
    openUpdateModal(id) {
      this.$refs.modal.open(ACTION_TYPE.UPDATE, id)
    },
    openDetailModal(id) {
      this.$refs.modal.open(ACTION_TYPE.DETAIL, id)
    },
    /** 清空按钮事件 */
    clearSearch () {
      this.searchInfo = {
        paramName: '',
        paramKey: ''
      }
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      this.commonDeleteRecord(removeById, id)
    },
    /** 批量删除 */
    handleBatchDelete () {
      this.commonBatchDelete(batchRemove)
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

.warp .operation-btn{
  margin: 20px 0;
}
</style>
