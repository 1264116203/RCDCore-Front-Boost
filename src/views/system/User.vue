<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="登录账号">
        <a-input v-model="searchInfo.account" placeholder="登录账号" />
      </a-form-item>
      <a-form-item label="用户昵称">
        <a-input v-model="searchInfo.name" placeholder="用户昵称" />
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
      :pagination="pagination"
      :columns="columns"
      :data-source="tableDataList"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
    >
      <template
        slot="operation"
        slot-scope="text, record"
      >
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
      <template #roleId="text, record">
        <a-tag v-if="record.roleName" color="blue">
          {{ record.roleName }}
        </a-tag>
      </template>
      <template #deptId="text, record">
        <a-tag v-if="record.deptName" color="blue">
          {{ record.deptName }}
        </a-tag>
      </template>
    </a-table>

    <user-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  getList,
  remove,
  singleRemove
} from '@/api/system/user'
import UserEdit from './UserEdit.vue'
import { ACTION_TYPE } from '@/config/env'

const columns = [
  {
    title: '登录账号',
    dataIndex: 'account'
  },
  {
    title: '用户昵称',
    dataIndex: 'name'
  },
  {
    title: '用户姓名',
    dataIndex: 'realName'
  },
  {
    title: '所属角色',
    dataIndex: 'roleId',
    scopedSlots: { customRender: 'roleId' }
  },
  {
    title: '所属部门',
    dataIndex: 'deptId',
    scopedSlots: { customRender: 'deptId' }
  },
  {
    title: '手机号码',
    dataIndex: 'phone'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    UserEdit
  },
  data () {
    return {
      tableDataList: [],
      /** 搜索的条件  登录账号 用户昵称 */
      searchInfo: {
        account: '',
        name: ''
      },
      columns,
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      },
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px',
      /** 全选 */
      selectedRowKeys: [],
      selectedRowIds: []
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      getList(this.pagination.current, this.pagination.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
          this.pagination.total = res.data.totalElements
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
        account: '',
        name: ''
      }
      this.fetchTableData()
    },
    handleTableChange(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.fetchTableData()
    },
    /** 添加按钮事件 */
    handleAdd () {
      this.openCreateModal()
    },
    /** 搜索按钮事件 */
    onSearch () {
      this.fetchTableData()
    },
    /** 弹框确定事件 */
    onModalOk(type, payload) {
      if (type !== 'detail') {
        this.onSearch()
      }
    },
    /** 全选按钮事件 */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowIds = selectedRows.map(item => item.id)
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      singleRemove(id).then(() => {
        this.fetchTableData()
        this.$message.success('操作成功!')
      })
    },
    /** 批量删除 */
    handleBatchDelete () {
      if (this.selectedRowIds.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      this.$confirm({
        title: '系统提示',
        content: '确定将选择数据删除?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          remove(this.selectedRowIds.join(',')).then(() => {
            this.fetchTableData()
            this.$message.success('操作成功!')
          })
        },
        onCancel: () => {
          console.log('Cancel')
        }
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

.warp .operation-btn{
  margin: 20px 0;
}
</style>
