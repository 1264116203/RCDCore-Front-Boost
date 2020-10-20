import { cloneDeep } from 'lodash'
import { _getArrDifference, _findChildren, _findParent, _includes, _deleteSame, _parentsChecked } from '@/util/tree'

export const myMixin = {
  data() {
    return {
      tableDataList: [],
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px',
      /** 全选 */
      selectedRowKeys: []
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {},
    handleTableChange(pagination) {
      this.pagination = cloneDeep(pagination)
      this.fetchTableData()
    },
    /** 添加按钮事件 */
    handleAdd () {
      this.openCreateModal()
    },
    /** 搜索按钮事件 */
    onSearch () {
      if (this.pagination) {
        this.pagination.current = 1
      }
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
    /** 批量删除 */
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
    /** 单行删除按钮事件 */
    commonDeleteRecord (api, id) {
      return api(id).then(() => {
        this.fetchTableData()
        this.$message.success('操作成功!')
      })
    }
  }
}
