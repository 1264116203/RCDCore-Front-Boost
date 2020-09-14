<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model layout="inline" :model="searchInfo">
      <a-form-model-item label="参数名称">
        <a-input v-model="searchInfo.paramName" placeholder="参数名称" />
      </a-form-model-item>
      <a-form-model-item label="参数键名">
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
      <a-button type="primary" @click="onAdd">
        添加
      </a-button>
      <a-button type="danger" @click="onBatchDelete">
        批量删除
      </a-button>
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :data-source="tableData"
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
import ParamEdit from './param-edit'
import mainMixin from '@/components/mixins/new-main-mixin'

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
  mixins: [mainMixin],
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
          this.tableData = res.data.content
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
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
    onBatchDelete () {
      this.commonBatchDelete(batchRemove)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
