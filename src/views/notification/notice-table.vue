<template>
  <a-spin class="warp" :spinning="isLoading">
    <a-form layout="inline" class="notice-from">
      <a-form-item label="消息数据类型">
        <a-select v-model="searchInfo.read">
          <a-select-option value="">
            全部数据
          </a-select-option>
          <a-select-option value="true">
            已读数据
          </a-select-option>
          <a-select-option value="false">
            未读数据
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="消息标题">
        <a-input v-model="searchInfo.title" placeholder="消息标题" />
      </a-form-item>
      <a-form-item label="消息类型">
        <a-input v-model="searchInfo.type" placeholder="消息类型" />
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker v-model="searchInfo.timeStart" placeholder="请选择开始时间" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker v-model="searchInfo.timeEnd" placeholder="请选择结束时间" />
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
      <a-button class="editable-add-btn" type="primary" @click="handleBatchRead">
        全部已读
      </a-button>
    </div>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :data-source="tableDataList"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :pagination="pagination"
      default-expand-all-rows
    >
      <template
        slot="operation"
        slot-scope="text, record"
      >
        <div class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" />详情
          </a>
        </div>
      </template>
      <template #read="text, record">
        <a-tag :color="record.read?'blue':'red'">
          {{ record.read?"已读":"未读" }}
        </a-tag>
      </template>
    </a-table>
  </a-spin>
</template>
<script>
import { _getArrDifference, _findChildren, _findParent, _includes, _deleteSame, _parentsChecked } from '@/util/tree'
import { listWithPagination, batchReadNotification } from '@/api/notification/notification'
import moment from 'moment'

const columns = [
  {
    title: '消息名称',
    dataIndex: 'title'
  },
  {
    title: '摘要',
    dataIndex: 'summary'
  },
  {
    title: '发送者',
    dataIndex: 'senderName'
  },
  {
    title: '已读状态',
    dataIndex: 'read',
    scopedSlots: { customRender: 'read' }
  },
  {
    title: '发送时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'NoticeTable',
  data () {
    return {
      tableDataList: [],
      columns,
      // 分页
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      },
      isLoading: false,
      // 全选
      selectedRowKeys: [],
      // 搜索
      searchInfo: {
        read: '',
        title: '',
        type: '',
        timeStart: null,
        timeEnd: null
      }
    }
  },
  computed: {
    detailsGrantVisible: {
      get() {
        return this.$store.state.notification.notificationModalVisible
      }
    },
    detailsId: {
      get() {
        return this.$store.state.notification.detailsId
      }
    }
  },
  created () {
    this.fetchNotificationData()
  },
  methods: {
    /** 表格数据 */
    fetchNotificationData () {
      this.isLoading = true

      const searchInfo = {
        ...this.searchInfo,
        timeStart: this.searchInfo.timeStart ? this.searchInfo.timeStart.valueOf() : null,
        timeEnd: this.searchInfo.timeEnd ? this.searchInfo.timeEnd.valueOf() : null,

        sort: ['createTime,desc']
      }

      listWithPagination(this.pagination.current - 1, this.pagination.pageSize, searchInfo)
        .then(res => {
          this.tableDataList = res.data.content
          this.pagination.total = res.data.totalElements
          /** 转换为时间格式 */
          this.tableDataList.map(item => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.isLoading = false
        })
    },
    /** 详情 */
    async openDetailModal (id) {
      await this.$store.dispatch('notification/getDetailsContent', id)
      this.$store.commit('notification/SET_MODAL_VISIBLE', true)
    },
    /** 搜索按钮事件 */
    onSearch () {
      this.pagination.current = 1
      this.fetchNotificationData()
    },
    /** 清空按钮事件 */
    clearSearch () {
      this.pagination.current = 1
      this.searchInfo = {
        read: '',
        title: '',
        type: '',
        timeStart: null,
        timeEnd: null
      }
      this.fetchNotificationData()
    },
    /** 批量已读 */
    handleBatchRead() {
      return new Promise((resolve) => {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('请选择至少一条数据')
          return
        }

        this.$confirm({
          title: '系统提示',
          content: '确定将所有数据设置为已读?',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            batchReadNotification(this.selectedRowKeys).then(() => {
              this.$store.dispatch('notification/getCount')
              resolve()
              this.fetchNotificationData()
              this.$message.success('操作成功!')
              this.selectedRowKeys = []
            })
          }
        })
      })
    },
    /** 全选按钮事件 */
    onSelectChange (selectedRowKeys, selectedRows) {
      /** 全部取消选中 */
      if (selectedRowKeys && selectedRowKeys.length === 0) {
        this.selectedRowKeys = []
        return
      }
      /** 当前点击的ID */
      let id = _getArrDifference(selectedRowKeys, this.selectedRowKeys)[0]
      /** 所有子集包括自己的ID */
      let childrenId = _findChildren(id, this.tableDataList).map(item => item.id)
      /** 所有父级的ID */
      let parentIds = _findParent(id, this.tableDataList).map(item => item.parentId)
      /** 判断当前点击的是否在以选中的数组 */
      if (_includes(this.selectedRowKeys, childrenId)) {
        /** 取消选中，自己，子集，父级 */
        this.selectedRowKeys = _deleteSame(this.selectedRowKeys, parentIds.concat(childrenId))
      } else {
        /** 选中，自己，子集，父级 */
        /** 保存已选中的 */
        let allSelectedIds = [...selectedRowKeys]
        /** 选中自己的子集 */
        if (childrenId && childrenId.length > 0) {
          allSelectedIds.push(...childrenId)
        }
        /** 当前节点 */
        let currentNode = selectedRows[0]
        /** 选中自己的父级 */
        _parentsChecked(currentNode, allSelectedIds, this.tableDataList)
        this.selectedRowKeys = [...new Set(allSelectedIds)]
      }
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
.notice-from .ant-form-item-control{
    width: 210px;
}
.notice-from .ant-select-selection{
        width: 190px;
}
</style>
