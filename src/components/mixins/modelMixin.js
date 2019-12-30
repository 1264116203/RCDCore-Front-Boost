export const modelMixin = {
  data() {
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      /** 信息展示的弹框 */
      formVisible: false,
      isDisable: false
    }
  },
  methods: {
    /** 增删改弹框的title */
    modelTitle(type) {
      if (type === 'creation') {
        this.title = '添加信息'
        this.isDisable = false
      } else if (type === 'detail') {
        this.title = '查看信息'
        this.isDisable = true
      } else if (type === 'update') {
        this.title = '修改信息'
        this.isDisable = false
      } else {
        return
      }
      this.actionType = type
      this.formVisible = true
    },
    /** 添加 表单内容 */
    addFormData() {
      const formData = this.form.getFieldsValue()

      return formData
    },
    /** 修改 表单内容 */
    updateFormData() {
      const formData = this.form.getFieldsValue()
      formData.id = this.id

      return formData
    },
    /** 添加信息 */
    addHandle(api) {
      const formData = this.addFormData()
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    /** 修改信息 */
    updateHandle(api) {
      const formData = this.updateFormData()
      formData.id = this.id
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    onSubmit() {
      switch (this.actionType) {
        case 'creation':
          this.doCreation()
          break
        case 'update':
          this.doUpdate()
          break
        case 'detail':
        default:
          this.doDetail()
      }
    },
    onOk() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.onSubmit()
        } else {
          this.$message.error('校验失败！')
          console.error(errors, values)
        }
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    doDetail() {
      this.$emit('ok', this.actionType)
      this.formVisible = false
    },
    /** 下拉弹层渲染节点固定在触发器的父元素中 */
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    }
  }
}
