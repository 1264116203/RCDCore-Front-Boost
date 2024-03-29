<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="菜单名称">
        <a-input v-model="searchInfo.name" placeholder="菜单名称" />
      </a-form-item>
      <a-form-item label="菜单编码">
        <a-input v-model="searchInfo.code" placeholder="菜单编码" />
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
      :pagination="pagination"
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
          <a @click="handleGrantSet(record.id)">
            <a-icon type="setting" />权限设置
          </a>
        </div>
      </template>
      <template #MenuIcon="text, record">
        <a-icon :type="record.source" />
      </template>
    </a-table>

    <top-menu-edit ref="modal" @ok="onModalOk" />

    <a-modal
      v-model="grantVisible"
      title="下级菜单配置"
      :mask-closable="false"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <div style="height: 50vh;min-height: 300px;overflow-y: auto">
          <no-half-tree
            v-model="menuSelected"
            :tree-data="resourceList"
          />
        </div>
      </a-spin>
    </a-modal>
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  grant,
  singleRemove
} from '@/api/system/top-menu'
import { ACTION_TYPE } from '@/config/env'
import TopMenuEdit from './top-menu-edit'
import { myMixin } from '@/components/mixins/main-mixin'
import { listMenuByTopMenuIdWithTree } from '@/api/system/authority'
import { mapGetters } from 'vuex'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name'
  },
  {
    title: '菜单编码',
    dataIndex: 'code'
  },
  {
    title: '菜单图标',
    dataIndex: 'source',
    scopedSlots: { customRender: 'MenuIcon' }
  },
  {
    title: '菜单排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'TopMenuList',
  components: {
    TopMenuEdit
  },
  mixins: [myMixin],
  data () {
    return {
      /** 搜索的条件  菜单名称 菜单编码 */
      searchInfo: {
        name: '',
        code: ''
      },
      columns,
      current: 1,
      pageSize: 10,
      /** 权限设置 */
      spinning: false,
      grantVisible: false,
      menuSelected: [],
      nowId: [],
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  computed: {
    ...mapGetters(['resourceList'])
  },
  created() {
    this.$store.dispatch('resource/getTree')
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      listWithPagination(this.current - 1, this.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
          this.pagination.total = res.data.totalElements
          /** 数据从小到大排序 */
          this.tableDataList.sort(function(a, b) {
            return a.sort - b.sort
          })
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
      this.pagination.current = 1
      this.searchInfo = {
        name: '',
        code: ''
      }
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      this.commonDeleteRecord(singleRemove, id)
    },
    /** 批量删除 */
    handleBatchDelete () {
      this.commonBatchDelete(batchRemove)
    },
    /** 设置权限 */
    handleGrantSet(id) {
      this.spinning = true
      this.nowId = [id]
      this.grantVisible = true
      listMenuByTopMenuIdWithTree(id).then(res => {
        const tree = res.data
        const keyList = []

        function fun(item) {
          keyList.push(item.id)
          if (item.children && item.children.length) {
            item.children.forEach(fun)
          }
        }
        tree.forEach(fun)

        this.menuSelected = keyList
      })
        .catch(err => console.error(err))
        .finally(() => {
          this.spinning = false
        })
    },
    onOk() {
      grant(this.menuSelected, this.nowId)
        .then(() => {
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
