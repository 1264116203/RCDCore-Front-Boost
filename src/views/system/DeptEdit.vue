<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="600px"
      :title="title"
      :mask-closable="false"
      :ok-button-props="{ props: {disabled: isDisable} }"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-form ref="form" :form="form" class="d2-col-form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @submit="onSubmit">
        <a-form-item label="机构名称">
          <a-input
            v-decorator="['deptName',{ rules: [{required: true,message: '请输入机构名称'}] }]"
            placeholder="请输入机构名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="机构全称">
          <a-input
            v-decorator="['fullName', { rules: [{ required: true, message: '请输入机构全称' },{whitespace:true,message:'用户昵称不能为空'}] }]"
            placeholder="请输入机构全称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="上级机构">
          <a-tree-select
            v-decorator="['parentId',{ rules: [{ required: true, message: '请选择上级机构' }] }]"
            placeholder="请选择上级机构"
            :tree-data="deptData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            tree-default-expand-all
            tree-checkable
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="排序">
          <a-input
            v-decorator="[
              'sort',
              { rules: [{
                required: true,
                message: '请输入排序'
              },{
                pattern:/\d/,
                message: '请输入数字'
              }] },
            ]"
            placeholder="请输入数字"
            type="number"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="备注">
          <a-input
            v-decorator="['remark', { rules: [{ required: true, message: '请输入备注'}] }]"
            placeholder="请输入备注"
            type="email"
            :disabled="isDisable"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  add,
  getDept,
  update,
  getDeptTree
} from '@/api/system/dept'
import { TreeSelect } from 'ant-design-vue'

const EmptyUserForm = {
  deptName: '',
  fullName: '',
  select: '',
  sort: '',
  remark: ''
}

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      formVisible: false,
      deptData: [],
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      isDisable: false
    }
  },
  created() {
    this.loadDeptTree()
  },
  methods: {
    open(type, id) {
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

      if (id) {
        this.id = id
        getDept(id).then(res => {
          const requestData = res.data.data
          const formData = {}

          Object.keys(EmptyUserForm).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyUserForm })
        })
      }
    },
    loadDeptTree() {
      getDeptTree().then(res => {
        this.deptData = res.data.data
      })
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
    doCreation() {
      const formData = this.form.getFieldsValue()
      formData.parentId = formData.parentId.join(',')
      console.log(formData)
      add(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    doUpdate() {
      const formData = this.form.getFieldsValue()
      formData.parentId = formData.parentId.join(',')
      formData.id = this.id
      update(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    /** 下拉弹层渲染节点固定在触发器的父元素中 */
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    }
  }
}
</script>

<style lang="less" scoped>
</style>
