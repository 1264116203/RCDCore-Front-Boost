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
      <a-button class="editable-add-btn" @click="handleResetPassword">
        重置密码
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
        <template v-if="record.roleName">
          <limited-tags :raw-name="record.roleName" />
        </template>
      </template>
      <template #deptId="text, record">
        <template v-if="record.deptName">
          <limited-tags :raw-name="record.deptName" />
        </template>
      </template>
    </a-table>

    <user-edit ref="modal" @ok="onModalOk" />

    <a-modal v-model="passwordInputvisible" title="请输入重置的密码" @ok="handleOK">
      <a-form ref="form" :form="passwordForm">
        <a-form-item>
          <a-input-password
            v-decorator="['newPassword', { rules: [
              { required: true,message: '请输入密码'},
              { pattern:/^(?=.*[0-9a-zA-Z])\w{4,16}$/, message: '必须有数字或者字母并且长度在4~16之间' }
            ]}]"
            placeholder="请输入重置的密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-spin>
</template>
<script>
import LimitedTags from '@/components/scraps/limited-tags'
import UserEdit from './user-edit'
import { ACTION_TYPE } from '@/config/env'
import { myMixin } from '@/components/mixins/main-mixin'
import { listWithPagination, batchRemove, removeById, resetPassword } from '@/api/system/user-management'
import { mapActions } from 'vuex'

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
    width: '15%',
    scopedSlots: { customRender: 'roleId' }
  },
  {
    title: '所属部门',
    dataIndex: 'deptId',
    width: '15%',
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
  name: 'UserList',
  components: {
    LimitedTags,
    UserEdit
  },
  mixins: [myMixin],
  data () {
    return {
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
      /** 新密码 */
      passwordForm: this.$form.createForm(this),
      passwordInputvisible: false,
      newPassword: ''
    }
  },
  created() {
    this.getRoleTree()
    this.getDeptData()
  },
  methods: {
    ...mapActions('role', { getRoleTree: 'getTree' }),
    ...mapActions('dept', { getDeptData: 'getDeptData' }),
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      listWithPagination(this.pagination.current - 1, this.pagination.pageSize, this.searchInfo)
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
      this.pagination.current = 1
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      this.commonDeleteRecord(removeById, id)
    },
    /** 批量删除 */
    handleBatchDelete () {
      this.commonBatchDelete(batchRemove)
    },
    /** 重置密码 */
    handleResetPassword () {
      return new Promise((resolve) => {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('请选择至少一条数据')
        } else {
          this.newPassword = ''
          this.passwordInputvisible = true
        }
      })
    },
    handleOK() {
      this.passwordForm.validateFields((errors, values) => {
        if (!errors) {
          this.newPassword = this.passwordForm.getFieldValue('newPassword')
          resetPassword(this.newPassword, this.selectedRowKeys).then(() => {
            this.fetchTableData()
            this.$message.success('操作成功!')
            this.passwordInputvisible = false
          })
        } else {
          this.$message.error('校验失败！')
          console.error(errors, values)
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
