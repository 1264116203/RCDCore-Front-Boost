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
        <a-form-item label="菜单名称">
          <a-input
            v-decorator="['name',{ rules: [{required: true,message: '请输入菜单名称'}] }]"
            placeholder="请输入菜单名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="路由地址">
          <a-input
            v-decorator="['path', { rules: [{ required: true, message: '请输入路由地址' },{whitespace:true,message:'用户昵称不能为空'}] }]"
            placeholder="请输入路由地址"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="dept" label="上级菜单">
          <a-tree-select
            v-decorator="[ 'parentId' ]"
            :tree-data="deptData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级菜单"
            tree-default-expand-all
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单图标">
          <a-cascader
            v-decorator="[
              'source',
              {
                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                rules: [
                  { type: 'array', required: true, message: '请输入菜单图标' },
                ],
              },
            ]"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单编号">
          <a-input
            v-decorator="[
              'code',
              { rules: [{
                required: true,
                message: '请输入菜单编号'
              }] },
            ]"
            placeholder="请输入菜单编号"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单类型">
          <a-radio-group v-decorator="['category',{ rules: [{required: true,message: '请选择菜单类型'}] }]" :disabled="isDisable">
            <a-radio value="1">
              菜单
            </a-radio>
            <a-radio value="2">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="菜单别名">
          <a-input
            v-decorator="['alias',{ rules: [{required: true,message: '请输入菜单别名'}] }]"
            placeholder="请输入菜单别名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单排序">
          <a-input
            v-decorator="['sort', { rules: [{ required: true, message: '请输入菜单排序' }] }]"
            placeholder="请输入菜单排序"
            type="number"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单备注" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入菜单备注"
            :autosize="{ minRows: 2, maxRows: 6 }"
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
  getUser,
  update
} from '@/api/system/menu'
import { TreeSelect } from 'ant-design-vue'

const EmptyUserForm = {
  path: '',
  name: '',
  code: '',
  sourceList: [],
  category: [],
  alias: '',
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
      roleData: [],
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      isDisable: false
    }
  },
  created() {
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
        getUser(id).then(res => {
          const requestData = res.data.data
          requestData.sex = res.data.data.sex + ''

          if (requestData.deptId) {
            requestData.currentDepts = requestData.deptId.split(',')
          }
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

      formData.deptId = formData.currentDepts.join(',')
      formData.roleId = formData.currentRoles.join(',')
      formData.birthday = formData.birthdayObj.format('YYYY-MM-DD HH:mm:ss')
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

      formData.deptId = formData.currentDepts.join(',')
      formData.roleId = formData.currentRoles.join(',')
      formData.birthday = formData.birthdayObj.format('YYYY-MM-DD HH:mm:ss')
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
  .d2-col-form {
    .ant-row {
      display: inline-block;
    }
    .ant-form-item {
      width: 50%;
    }
  }
</style>
