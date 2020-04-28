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
      <template #MenuIcon="text, record">
        <a-icon v-if="record.icon" :type="record.icon" />
      </template>
    </a-table>

    <menu-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  queryListWithTree,
  batchDelete,
  deleteById
} from '@/api/system/menu'
import { ACTION_TYPE } from '@/config/env'
import MenuEdit from './MenuEdit.vue'
import { myMixin } from '@/components/mixins/MainMixin'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name'
  },
  {
    title: '路由地址',
    dataIndex: 'path'
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
  name: 'MenuView',
  components: {
    MenuEdit
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
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      queryListWithTree(this.searchInfo)
        .then(res => {
          const tableDataList = res.data
          /** 表格数据从小到大排序 */
          tableDataList.sort(function(a, b) {
            return a.sort - b.sort
          })
          this.tableDataList = tableDataList
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
        name: '',
        code: ''
      }
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      this.commonDeleteRecord(deleteById, id).then(() => {
        this.$store.dispatch('resource/getTree')
      })
    },
    /** 批量删除 */
    handleBatchDelete () {
      this.commonBatchDelete(batchDelete).then(() => {
        this.$store.dispatch('resource/getTree')
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
