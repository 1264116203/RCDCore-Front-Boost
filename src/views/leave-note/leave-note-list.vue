<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <!-- 在此处添加查询条件 -->
      <!--<a-form-model-item label="参数名称" prop="paramName">
        <a-input v-model="searchInfo.paramName" placeholder="参数名称" />
      </a-form-model-item>-->

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
      <a-button v-show="!isDisplay" type="primary" @click="openCreateModal">
        添加
      </a-button>
      <a-button type="danger" @click="commonBatchDelete">
        批量删除
      </a-button>
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="onTableChange"
    >
      <template #momentTime="text">
        <span>{{ text | momentTime }}</span>
      </template>
      <template #roverState="text">
        <span v-if="text === 0" style="color: #eadb5b">未审核</span>
        <span v-else-if="text === 1" style="color: #4dfd04">申请通过</span>
        <span v-else style="color: #f5222d">申请被拒绝</span>
      </template>
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
          <a-popconfirm title="是否删除?" @confirm="commonDeleteRecord(record.id)">
            <a>
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>

    <edit-dialog ref="modal" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/leave-note/leave-note'
import EditDialog from './leave-note-edit'
import { ListMixin } from '@/components/mixins/common-crud-mixin'

const columns = [
  {
    title: '请假人名字',
    dataIndex: 'realName'
  },
  {
    title: '请假人所属部门',
    dataIndex: 'deptName'
  },
  {
    title: '请假人手机号',
    dataIndex: 'phone'
  },
  {
    title: '请假时间起',
    dataIndex: 'leaveStart',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '请假时间止',
    dataIndex: 'leaveEnd',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '请假事由',
    dataIndex: 'leaveReason'
  },
  {
    title: '审批者',
    dataIndex: 'approver'
  },
  {
    title: '审批状态',
    dataIndex: 'approverState',
    scopedSlots: { customRender: 'roverState' }
  },
  {
    title: '审批意见',
    dataIndex: 'approverOpinion'
  },
  {
    title: '审批时间',
    dataIndex: 'approverTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'LeaveNoteList',
  components: { EditDialog },
  mixins: [ListMixin],
  data() {
    return {
      /** 查询条件 */
      searchInfo: {},
      columns,
      // 使用角色权限控制是否显示
      isDisplay: false
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
    this.roleList = JSON.parse(localStorage.getItem('RCDCore-userInfo')).content.roleList
    this.isDisplay = this.roleList.filter(e => {
      return e.roleAlias === 'minister'
    }).length > 0
  }
}
</script>

<style lang="less" scoped>

</style>
