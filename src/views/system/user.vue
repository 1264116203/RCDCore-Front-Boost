<template>
  <a-spin
    class="warp"
    :spinning="isLoading"
  >
    <a-form layout="inline">
      <a-form-item label="登录账号">
        <a-input
          v-model="searchInfo.account"
          placeholder="登录账号"
        />
      </a-form-item>
      <a-form-item label="用户昵称">
        <a-input
          v-model="searchInfo.name"
          placeholder="用户昵称"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          @click="handleSearch"
        >
          搜索
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="clearSearch">
          清空
        </a-button>
      </a-form-item>
    </a-form>
    <br>
    <div>
      <a-button
        class="editable-add-btn"
        @click="handleAdd"
      >
        添加
      </a-button>
      <a-button
        class="editable-add-btn"
        @click="handleDeleteList"
      >
        批量删除
      </a-button>
    </div>
    <br>
    <a-table
      :columns="columns"
      :data-source="tableDataList"
      bordered
      :pagination="false"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      row-key="id"
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
      <template
        slot="roleId"
        slot-scope="text, record"
      >
        <a-tag v-if="record.roleName" color="blue">
          {{ record.roleName }}
        </a-tag>
      </template>
      <template
        slot="deptId"
        slot-scope="text, record"
      >
        <a-tag v-if="record.deptName" color="blue">
          {{ record.deptName }}
        </a-tag>
      </template>
    </a-table>
    <br>
    <a-pagination
      v-model="current"
      :total="total"
      show-size-changer
      show-quick-jumper
      :page-size.sync="pageSize"
    />
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
      confirmPassword: '',
      tableDataList: [],
      columns,
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px',
      handleType: '',
      searchInfo: {
        account: '',
        name: ''
      },
      total: 0,
      pageSize: 10,
      current: 1,
      recordId: '1',
      selectedRowKeys: [],
      selectedRowIds: []
    }
  },
  watch: {
    pageSize () {
      this.fetchTableData()
    },
    current () {
      this.fetchTableData()
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    fetchTableData () {
      this.isLoading = true
      getList(this.current, this.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    handleAdd () {
      this.handleType = 'add'
    },
    handleSearch () {
      this.fetchTableData()
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
    deleteRecord (id) {
      remove(id).then(() => {
        this.fetchTableData()
        this.$message.success('操作成功!')
      })
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowIds = selectedRows.map(item => item.id)
    },
    handleDeleteList () {
      if (this.selectedRowIds.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      let _this = this
      this.$confirm({
        title: '系统提示',
        content: '确定将选择数据删除?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk () {
          remove(_this.selectedRowIds.join(',')).then(() => {
            _this.fetchTableData()
            _this.$message.success('操作成功!')
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    resetHandler() {
      this.handleType = ''
      this.recordId = ''
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
