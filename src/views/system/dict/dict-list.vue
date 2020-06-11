<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline">
      <a-form-item label="字典编码">
        <a-input v-model="searchInfo.code" placeholder="字典编码" />
      </a-form-item>
      <a-form-item label="字典名称">
        <a-input v-model="searchInfo.name" placeholder="字典名称" />
      </a-form-item>
      <a-form-item label="字典备注">
        <a-input v-model="searchInfo.remark" placeholder="字典备注" />
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
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :data-source="tableDataList"
      :expanded-row-keys="expandedRowKeys"
      @change="handleTableChange"
      @expand="onExpand"
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
        <a-icon :type="record.source">
          {{ record.source }}
        </a-icon>
      </template>
      <a-table
        slot="expandedRowRender"
        slot-scope="row"
        :columns="innerColumns"
        :data-source="getInnerData(row)"
        :pagination="false"
      />
    </a-table>

    <dict-edit ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  removeById,
  getById
} from '@/api/system/dict'
import { ACTION_TYPE } from '@/config/env'
import DictEdit from './dict-edit'
import { myMixin } from '@/components/mixins/main-mixin'

const columns = [
  {
    title: '字典编码',
    dataIndex: 'code'
  },
  {
    title: '字典名称',
    dataIndex: 'name'
  },
  {
    title: '字典排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const innerColumns = [
  {
    title: '字典项的键',
    dataIndex: 'dictKey'
  },
  {
    title: '字典项的值',
    dataIndex: 'dictValue'
  },
  {
    title: '字典项的类型',
    dataIndex: 'dictType'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
]
export default {
  name: 'DictList',
  components: {
    DictEdit
  },
  mixins: [myMixin],
  data () {
    return {
      /** 搜索的条件  字典编码 字典名称 字典备注 */
      searchInfo: {
        code: '',
        name: '',
        remark: ''
      },
      columns,
      innerColumns,
      current: 0,
      pageSize: 10,
      innerData: {},
      expandedRowKeys: []
    }
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {
      this.isLoading = true
      listWithPagination(this.current, this.pageSize, this.searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
          /** 表格数据从小到大排序 */
          this.tableDataList.sort(function(a, b) {
            return a.sort - b.sort
          })
          this.innerData = {}
          this.expandedRowKeys = []
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
        code: '',
        name: '',
        remark: ''
      }
      this.fetchTableData()
    },
    /** 单行删除按钮事件 */
    onDeleteRecord (id) {
      this.commonDeleteRecord(removeById, id)
    },
    getInnerData(record) {
      return this.innerData[record.id]
    },
    /** 点击展开图标事件 */
    onExpand(expanded, record) {
      if (!expanded) {
        this.expandedRowKeys = []
        return
      }
      this.expandedRowKeys.push(record.id)
      let id = record.id
      getById(id)
        .then(res => {
          this.spinning = true
          if (res.data.itemList && res.data.itemList.length > 0) {
            let innerData = res.data.itemList
            /** 表格数据从小到大排序 */
            innerData.sort(function(a, b) {
              return a.sort - b.sort
            })
            this.$set(this.innerData, id, innerData)
          }
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.spinning = false })
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
