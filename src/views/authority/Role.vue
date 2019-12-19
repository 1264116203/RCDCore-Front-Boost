<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="角色名称">
        <a-input v-model="searchInfo.roleName" placeholder="角色名称" />
      </a-form-item>
      <a-form-item label="角色别名">
        <a-input v-model="searchInfo.roleAlias" placeholder="角色别名" />
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
      <a-button class="editable-add-btn" type="primary" @click="handleGrantSet">
        权限设置
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

    <role-edit ref="modal" @ok="onModalOk" />

    <a-modal
      v-model="grantVisible"
      title="角色权限配置"
      @ok="onOk"
    >
      <a-tabs default-active-key="0">
        <a-tab-pane v-for="(value, key, index) in grantTreeDta" :key="index" :tab="title[key]">
          <a-tree
            v-model="defaultSelected [ key ]"
            checkable
            :tree-data="value"
            :selected-keys="selectedKeys"
            @check="(checkedKeys) => onSelectGrant(checkedKeys,key)"
          />
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </a-spin>
</template>
<script>
import {
  getList,
  remove,
  grantTree,
  grant,
  getRoleTreeKeys
} from '@/api/system/role'
import { ACTION_TYPE } from '@/config/env'
import RoleEdit from './RoleEdit.vue'

const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName'
  },
  {
    title: '角色别名',
    dataIndex: 'roleAlias'
  },
  {
    title: '角色排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    RoleEdit
  },
  data () {
    return {
      tableDataList: [],
      /** 搜索的条件  角色名称 角色别名 */
      searchInfo: {
        roleName: '',
        roleAlias: ''
      },
      columns,
      current: 1,
      pageSize: 10,
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px',
      /** 全选 */
      selectedRowKeys: [],
      selectedRowIds: [],
      /** 权限设置 */
      title: { 'menu': '菜单权限', 'dataScope': '数据权限', 'apiScope': '接口权限' },
      defaultSelected: { 'menu': [], 'dataScope': [], 'apiScope': [] },
      grantVisible: false,
      grantTreeDta: {},
      selectedKeys: [],
      menuIds: [],
      dataScopeIds: [],
      apiScopeIds: []
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      getList(this.current, this.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.data
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
        roleName: '',
        roleAlias: ''
      }
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
      remove(id).then(() => {
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
    },
    /** 设置权限 */
    handleGrantSet() {
      if (this.selectedRowIds && this.selectedRowIds.length === 1) {
        this.grantVisible = true
        grantTree().then(res => {
          this.grantTreeDta = res.data.data
        })
        getRoleTreeKeys(this.selectedRowIds.join(',')).then(res => {
          this.menuIds = [...res.data.data.menu]
          this.dataScopeIds = [...res.data.data.dataScope]
          this.apiScopeIds = [...res.data.data.apiScope]
          this.defaultSelected = res.data.data
        })
      } else if (this.selectedRowIds && this.selectedRowIds.length < 1) {
        this.$message.warning('请至少选择一条数据')
      } else {
        this.$message.warning('只能选择一条数据')
      }
    },
    onSelectGrant(checkedKeys, key) {
      switch (key) {
        case 'menu':
          this.menuIds = [...checkedKeys]
          break
        case 'dataScope':
          this.dataScopeIds = [...checkedKeys]
          break
        case 'apiScope':
          this.apiScopeIds = [...checkedKeys]
          break
      }
    },
    onOk() {
      grant(this.selectedRowIds, this.menuIds, this.dataScopeIds, this.apiScopeIds).then(() => {
        this.$message.success('操作成功')
        this.grantVisible = false
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
