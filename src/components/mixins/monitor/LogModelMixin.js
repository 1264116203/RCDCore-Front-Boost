export const LogModelMixin = {
  data() {
    return {
      form: this.$form.createForm(this),
      /** *信息展示的弹框 */
      formVisible: false,
      isDisable: true
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    }
  }
}
