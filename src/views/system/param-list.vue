<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="参数名称" prop="paramName">
        <a-input v-model="searchInfo.paramName" placeholder="参数名称" />
      </a-form-model-item>

      <a-form-model-item label="参数键名" prop="paramKey">
        <a-input v-model="searchInfo.paramKey" placeholder="参数键名" />
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" @click="onSearch">
          搜索
        </a-button>
      </a-form-model-item>

      <a-form-model-item>
        <a-button @click="clearSearch">
          清空
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <div class="operation-btn-container">
      <a-button type="primary" @click="openCreateModal">
        添加
      </a-button>
      <a-button type="danger" @click="commonBatchDelete">
        批量删除
      </a-button>
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="onTableChange"
    >
      <template #operation="text, record">
        <div class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" /> 查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" /> 修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="commonDeleteRecord(record.id)">
            <a>
              <a-icon type="delete" /> 删除
            </a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>

    <edit-dialog ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/system/param'
import ParamEdit from './param-edit'
import { ListMixin } from '@/components/mixins/common-crud-mixin'

const columns = [{
  title: '参数名称',
  dataIndex: 'paramName'
}, {
  title: '参数键名',
  dataIndex: 'paramKey'
}, {
  title: '参数键值',
  dataIndex: 'paramValue'
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  name: 'ParamList',
  components: { EditDialog: ParamEdit },
  mixins: [ListMixin],
  data() {
    return {
      /** 查询条件 */
      searchInfo: {
        paramName: '',
        paramKey: ''
      },
      columns
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  }
}
</script>

<style lang="less" scoped>

</style>
