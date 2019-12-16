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
        <a-button type="primary" @click="handleSearch">
          搜索
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="clearSearch">
          清空
        </a-button>
      </a-form-item>
    </a-form>

    <div>
      <a-button class="editable-add-btn" type="primary" @click="handleAdd">
        添加
      </a-button>
      <a-button class="editable-add-btn" type="danger" @click="handleDeleteList">
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
          <a @click="() => view(record.id)">
            <a-icon type="edit" />查看
          </a>
          <a @click="() => edit(record.id)">
            <a-icon type="edit" />修改
          </a>
          <a-popconfirm
            title="是否删除?"
            @confirm="() => deleteRecord(record.id)"
          >
            <a>
              <a-icon type="delete" />删除
            </a>
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

    <userEdit
      :record-id="recordId"
      :handle-type="handleType"
      @fetchTableData="fetchTableData"
      @resetHandler="resetHandler"
    />
  </a-spin>
</template>
<script>
import {
  getList,
  remove
} from '@/api/system/user'
import userEdit from './userEdit.vue'

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
    userEdit
  },
  data () {
    return {
      tableDataList: [],
      searchInfo: {
        account: '',
        name: ''
      },
      handleType: '',
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
      recordId: '1',
      selectedRowKeys: [],
      selectedRowIds: []
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    fetchTableData () {
      this.isLoading = true
      getList(this.pagination.current, this.pagination.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.data.records
          this.pagination.total = res.data.data.total
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    resetHandler() {
      this.handleType = ''
      this.recordId = ''
    },
    clearSearch () {
      this.searchInfo = {
        account: '',
        name: ''
      }
      this.fetchTableData()
    },
    edit (id) {
      this.handleType = 'edit'
      this.recordId = id
    },
    view(id) {
      this.handleType = 'view'
      this.recordId = id
    },
    handleTableChange(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.fetchTableData()
    },
    handleAdd () {
      this.handleType = 'add'
    },
    handleSearch () {
      this.fetchTableData()
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowIds = selectedRows.map(item => item.id)
    },
    deleteRecord (id) {
      remove(id).then(() => {
        this.fetchTableData()
        this.$message.success('操作成功!')
      })
    },
    handleDeleteList () {
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
.warp .ant-btn{
  margin-right: 20px;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>
