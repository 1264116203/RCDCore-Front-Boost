import { cloneDeep } from 'lodash'

export const MainMixin = {
  data() {
    return {
      tableDataList: [],
      /** 搜索的条件  服务id 服务host */
      searchInfo: {
        serviceId: '',
        serverHost: ''
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    /** 表格数据 */
    fetchTableData () {},
    openDetailModal(id) {
      this.$refs.modal.open(id)
    },
    /** 分页点击事件 */
    handleTableChange(pagination) {
      this.pagination = cloneDeep(pagination)
      this.fetchTableData()
    },
    onModalOk() {
      this.fetchTableData()
    },
    /** 搜索按钮事件 */
    onSearch () {
      this.fetchTableData()
    },
    /** 清空按钮事件 */
    clearSearch () {
      this.searchInfo = {
        serviceId: '',
        serverHost: ''
      }
      this.fetchTableData()
    }
  }
}
