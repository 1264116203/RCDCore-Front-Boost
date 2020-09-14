import { cloneDeep } from 'lodash'
import { _getArrDifference, _findChildren, _findParent, _includes, _deleteSame, _parentsChecked } from '@/util/tree'
import { ACTION_TYPE } from '@/config/env'

export default {
  data() {
    return {
      /** 分页列表数据 */
      tableData: [],
      /** 页面是否加载 */
      isLoading: false,
      /** 列表中选中的记录的主键集合 */
      selectedRowKeys: []
    }
  },
  /** 组件创建的钩子函数，拉取一次分页数据 */
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 拉取表格数据的虚函数，由组件去实现 */
    fetchTableData () {},
    openCreateModal() {
      this.$refs.modal.open(ACTION_TYPE.CREATION)
    },
    openUpdateModal(id) {
      this.$refs.modal.open(ACTION_TYPE.UPDATE, id)
    },
    openDetailModal(id) {
      this.$refs.modal.open(ACTION_TYPE.DETAIL, id)
    },
    /**
     * 响应 AntD 的 Table 组件自身的数据变化（分页页码等）
     * @param pagination 新的分页数据
     */
    handleTableChange(pagination) {
      this.pagination = cloneDeep(pagination)
      this.fetchTableData()
    },
    /** 添加按钮触发的回调（打开添加表单） */
    onAdd () {
      this.openCreateModal()
    },
    /** 搜索按钮触发的回调（拉取分页数据） */
    onSearch () {
      this.fetchTableData()
    },
    /** 弹框确定按钮触发的回调（拉取分页数据，查看详情时除外） */
    onModalOk(type, payload) {
      if (type !== 'detail') {
        this.onSearch()
      }
    },
    /**
     * 列表的选择项变化触发的回调
     * 默认的 AntD 的 Table 不会对树形列表的选择做级联选择，该方法便是相关操作的实现
     *
     * 仅用于树形表格，为了避免不必要的性能开销，普通列表不需要使用本方法
     */
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
    },
    /**
     * 默认的批量删除方法
     * @param api 批量删除的方法
     */
    commonBatchDelete(api) {
      return new Promise((resolve) => {
        if (this.selectedRowKeys.length === 0) {
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
            api(this.selectedRowKeys.join(',')).then(() => {
              resolve()
              this.fetchTableData()
              this.$message.success('操作成功!')
            })
          }
        })
      })
    },
    /**
     * 默认的单个删除方法
     *
     * @param api 单个删除的方法
     * @param id 要删除的记录的ID
     */
    commonDeleteRecord (api, id) {
      return api(id).then(() => {
        this.fetchTableData()
        this.$message.success('操作成功!')
      })
    }
  }
}
