export const modelMixin = {
  data() {
    return {
      /** 当前数据项的id，新增时则为空 */
      id: '',
      /** 对话框标题 */
      title: '',
      /** AntDesign form对象 */
      form: this.$form.createForm(this),
      /** 动作类型，可选值：creation/detail/update */
      actionType: 'creation',
      /** 表单项是否可编辑 */
      isDisable: false,
      /** 对话框的显隐状态 */
      formVisible: false,
      /** 加载状态 */
      spinning: false
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
    getFormDataForInsert() {
      return this.form.getFieldsValue()
    },
    /** 修改 表单内容 */
    getFormDataForUpdate() {
      const formData = this.form.getFieldsValue()
      formData.id = this.id

      return formData
    },
    /** 添加信息 */
    doInsert(api) {
      this.spinning = true
      const formData = this.getFormDataForInsert()
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据插入成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.spinning = false })
    },
    /** 修改信息 */
    doUpdate(api) {
      this.spinning = true
      const formData = this.getFormDataForUpdate()
      formData.id = this.id
      return api(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('数据更新成功!')
          this.formVisible = false
          this.reset()
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.spinning = false })
    },
    reset() {
      this.id = null
      this.form.resetFields()
    },
    onSubmit() {
      switch (this.actionType) {
        case 'creation':
          this.onInsert()
          break
        case 'update':
          this.onUpdate()
          break
        case 'detail':
        default:
          this.onDetail()
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
      this.reset()
    },
    onDetail() {
      this.$emit('ok', this.actionType)
      this.reset()
      this.formVisible = false
    },
    /** 下拉弹层渲染节点固定在触发器的父元素中 */
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    }
  }
}
