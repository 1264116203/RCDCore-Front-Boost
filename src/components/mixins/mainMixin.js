import { defaultsDeep } from 'lodash'

export const myMixin = {
  data() {
    return {
      tableDataList: [],
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px',
      /** 全选 */
      selectedRowKeys: [],
      selectedRowIds: []
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {},
    handleTableChange(pagination) {
      // this.pagination = { ...this.pagination, ...pagination }
      this.pagination = defaultsDeep(this.pagination, pagination)
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
    /** 批量删除 */
    commonBatchDelete(api) {
      return new Promise((resolve, reject) => {
        if (this.selectedRowIds.length === 0) {
          this.$message.warning('请选择至少一条数据')
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('请选择至少一条数据')
        }

        this.$confirm({
          title: '系统提示',
          content: '确定将选择数据删除?',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            api(this.selectedRowIds.join(',')).then(() => {
              resolve()
              this.fetchTableData()
              this.$message.success('操作成功!')
            })
          },
          onCancel: () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('cancel')
            console.log('Cancel')
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
