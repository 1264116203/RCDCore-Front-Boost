import { defaultsDeep } from 'lodash'
import moment from 'moment'

export const LogMainMixin = {
  data() {
    return {
      tableDataList: [],
      /** 搜索的条件  服务id 服务host */
      searchInfo: {
        serviceId: '',
        serverHost: ''
      },
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      },
      /** 页面是否加载 */
      isLoading: false,
      formLabelWidth: '120px'
    }
  },
  created () {
  },
  methods: {
    /** 表格数据 */
    fetchTableData (api) {
      this.isLoading = true
      api(this.pagination.current, this.pagination.pageSize, this.searchInfo)
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
    openDetailModal(id) {
      this.$refs.modal.open(id)
    },
    handleTableChange(pagination) {
      this.pagination = defaultsDeep(this.pagination, pagination)
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
