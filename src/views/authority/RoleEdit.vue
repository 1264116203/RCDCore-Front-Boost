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
      <a-form ref="form" :form="form" class="d2-col-form"
              :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
              @submit="onSubmit"
      >
        <a-form-item label="角色名称">
          <a-input
            v-decorator="['roleName',{ rules: [{required: true,message: '请输入角色名称'}] }]"
            placeholder="请输入角色名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="角色别名">
          <a-input
            v-decorator="['roleAlias', { rules: [{ required: true, message: '请输入角色别名' }] }]"
            placeholder="请输入角色别名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="上级角色">
          <a-tree-select
            v-decorator="[ 'parentId' ]"
            :tree-data="RoleParentData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级角色"
            tree-default-expand-all
            :show-checked-strategy="SHOW_PARENT"
            :disabled="isDisable"
            :multiple="false"
          />
        </a-form-item>

        <a-form-item label="角色排序">
          <a-input
            v-decorator="['sort', { rules: [{ required: true, message: '请输入角色排序' }] }]"
            placeholder="请输入角色排序"
            type="number"
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
  update,
  getRole,
  getRoleTree
} from '@/api/system/role'
import { TreeSelect } from 'ant-design-vue'

const EmptyUserForm = {
  roleName: '',
  roleAlias: '',
  parentId: '',
  sort: ''
}

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      /** *信息展示的弹框 */
      formVisible: false,
      isDisable: false,
      RoleParentData: [],
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT
    }
  },
  created() {
    this.loadParentData()
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
        getRole(id).then(res => {
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
    openMenuModal() {
      this.menuVisible = true
    },
    loadParentData() {
      getRoleTree().then(res => {
        console.log(res)
        this.RoleParentData = res.data.data
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
