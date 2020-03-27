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
            <a-icon type="eye" />
            查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" />
            修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="onDeleteRecord(record.id)">
            <a>
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
          <a @click="handleGrantSet(record.id)">
            <a-icon type="setting" />
            权限设置
          </a>
          <a @click="handleMenuSet(record.id)">
            <a-icon type="setting" />
            子集菜单设置
          </a>
        </div>
      </template>
    </a-table>

    <role-edit ref="modal" @ok="onModalOk" />

    <a-modal
      v-model="grantVisible"
      title="角色权限配置"
      :mask-closable="false"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <div style="height: 50vh;min-height: 300px;overflow-y: auto">
          <tree-checked
            :checked-keys.sync="checkedKeys"
            :selected-data.sync="authSelected"
            :default-checked-keys="checkedKeys"
            :tree-data="menuTree"
          />
        </div>
      </a-spin>
    </a-modal>

    <a-modal
      v-model="menuGrantVisible"
      title="下级菜单配置"
      :mask-closable="false"
      @ok="onSetMenuOk"
    >
      <a-spin :spinning="spinning">
        <div style="height: 25vh;min-height: 100px;overflow-y: auto">
          <a-tree
            checkable
            default-expand-all
            :tree-data="menuIdTree"
            :replace-fields="{
              title:'name',
              key:'id'
            }"
            :checked-keys="menuCheckedKeys"
            @check="onCheckMenu"
          />
        </div>
      </a-spin>
    </a-modal>
  </a-spin>
</template>
<script>
import {
  getList,
  remove,
  grant,
  singleRemove,
  setTopMenuGrant
} from '@/api/system/role'
import { ACTION_TYPE } from '@/config/env'
import RoleEdit from './RoleEdit.vue'
import { myMixin } from '@/components/mixins/MainMixin'
import { AllTree, byRoleIdMenuWithTree } from '@/api/system/menu'
import { byRoleIdMenuIdTree, AllTopMenulist } from '@/api/system/topmenu'
import TreeChecked from '@/components/tree-checked/TreeChecked'

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
    RoleEdit,
    TreeChecked
  },
  mixins: [myMixin],
  data() {
    return {
      /** 搜索的条件  角色名称 角色别名 */
      searchInfo: {
        roleName: '',
        roleAlias: ''
      },
      columns,
      current: 1,
      pageSize: 10,
      /** 权限设置 */
      spinning: false,
      menuTree: [],
      grantVisible: false,
      checkedKeys: {
        checked: [],
        halfChecked: []
      },
      authSelected: [],
      nowId: [],
      /** 权限设置 */
      menuIdTree: [],
      menuGrantVisible: false,
      menuCheckedKeys: [],
      menuNowId: []
    }
  },
  created() {
    AllTree().then(res => {
      this.menuTree = res.data
    })
    AllTopMenulist().then(res => {
      this.menuIdTree = res.data
    })
  },
  methods: {
    /** 表格数据 */
    fetchTableData() {
      this.isLoading = true
      getList(this.searchInfo)
        .then(res => {
          this.tableDataList = res.data
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
    clearSearch() {
      this.searchInfo = {
        roleName: '',
        roleAlias: ''
      }
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord(id) {
      this.commonDeleteRecord(singleRemove, id).then(() => {
        this.$store.dispatch('role/getTree')
      })
    },
    /** 批量删除 */
    handleBatchDelete() {
      this.commonBatchDelete(remove).then(() => {
        this.$store.dispatch('role/getTree')
      })
    },
    /** 设置权限 */
    handleGrantSet(id) {
      this.spinning = true
      this.nowId = [id]
      this.grantVisible = true
      byRoleIdMenuWithTree(id).then(res => {
        const tree = res.data
        const keyList = []

        function fun(item) {
          keyList.push(item.id)
          if (item.children && item.children.length) {
            item.children.forEach(fun)
          }
        }
        tree.forEach(fun)

        this.checkedKeys = {
          checked: keyList,
          halfChecked: []
        }
        this.authSelected = [...this.checkedKeys.checked]
      })
        .catch(err => console.error(err))
        .finally(() => {
          this.spinning = false
        })
    },
    onOk() {
      grant(this.authSelected, this.nowId)
        .then(() => {
          this.$message.success('操作成功')
          this.grantVisible = false
        })
    },
    /** 子集菜单设置 */
    handleMenuSet(id) {
      this.spinning = true
      this.menuNowId = [id]
      this.menuGrantVisible = true
      byRoleIdMenuIdTree(id).then(res => {
        this.menuCheckedKeys = res.data.map(item => item.id)
      })
        .catch(err => console.error(err))
        .finally(() => {
          this.spinning = false
        })
    },
    onCheckMenu(checkedKeys) {
      this.menuCheckedKeys = checkedKeys
    },
    onSetMenuOk() {
      setTopMenuGrant(this.menuNowId, this.menuCheckedKeys)
        .then(() => {
          this.$message.success('操作成功')
          this.menuGrantVisible = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../custom-variables";

  .warp {
    margin: 20px;
  }

  .warp .operation-btn .editable-add-btn {
    margin-right: 20px;
  }

  .editable-row-operations a {
    margin-right: 8px;
  }

  .warp .operation-btn {
    margin: 20px 0;
  }

  .sel-link {
    color: @primary-color;
    font-size: 12px;

    &:hover {
      text-decoration: underline;
    }

    &.danger {
      color: @btn-danger-color;
    }
  }
</style>
