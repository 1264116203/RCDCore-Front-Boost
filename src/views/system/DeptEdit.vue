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
        <a-form-item label="登录账号" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="[
              'account',
              { rules: [{ required: true, message: '请输入登录账号' },{whitespace:true,message:'登录账号不能为空'}] },
            ]"
            placeholder="登录账号"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item v-if="actionType === 'creation'" label="密码">
          <a-input
            v-decorator="[
              'password',
              { rules: [{
                required: true,
                validator: validatePass
              },{
                pattern:/^[a-zA-Z]\w{5,17}$/,
                message: '以字母开头，长度在6~18之间'
              }] },
            ]"
            placeholder="请输入密码"
            type="password"
          />
        </a-form-item>
        <a-form-item v-if="actionType === 'creation'" label="确认密码">
          <a-input
            v-decorator="[
              'passwordAgain',
              { rules: [{
                required: true,
                validator: validatePass2
              }] },
            ]"
            placeholder="请再次输入密码"
            type="password"
          />
        </a-form-item>

        <a-form-item label="用户姓名">
          <a-input
            v-decorator="[
              'name',
              { rules: [{
                required: true,
                message: '请输入用户姓名'
              }, {
                min: 2,
                max: 5,
                message: '姓名长度在2到5个字符'
              }] },
            ]"
            placeholder="请输入用户姓名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="用户昵称">
          <a-input
            v-decorator="[
              'realName',
              { rules: [{ required: true, message: '请输入用户昵称' },{whitespace:true,message:'用户昵称不能为空'}] },
            ]"
            placeholder="请输入用户昵称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="所属角色">
          <a-tree-select
            v-decorator="[
              'currentRoles',
              { rules: [{ required: true, message: '请选择所属角色' }] },
            ]"
            placeholder="请选择所属角色"
            :tree-data="roleData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            tree-default-expand-all
            tree-checkable
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="dept" label="所属部门">
          <a-tree-select
            v-decorator="[
              'currentDepts',
              { rules: [{ required: true, message: '请选择所属部门' }] },
            ]"
            :tree-data="deptData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择所属部门"
            tree-default-expand-all
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="手机号">
          <a-input
            v-decorator="[
              'phone',
              { rules: [{
                required: true,
                message: '请输入手机号'
              },{
                pattern:/^1[0-9]{10}$/,
                message: '请输入以1开头的11位手机号码'
              }] },
            ]"
            placeholder="请输入手机号"
            type="phone"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="电子邮箱">
          <a-input
            v-decorator="[
              'email',
              { rules: [{
                required: true,
                message: '请输入电子邮箱'
              },{
                pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: '请输入正确的邮箱'
              }] },
            ]"
            placeholder="请输入电子邮箱"
            type="email"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="用户性别">
          <a-select
            v-decorator="[
              'sex',
              { rules: [{ required: true, message: '请输入用户性别' },{whitespace:true,message:'用户性别不能为空'}] },
            ]"
            placeholder="请输入用户性别"
            :get-popup-container="getPopupContainer"
            :disabled="isDisable"
          >
            <a-select-option value="1">
              男
            </a-select-option>
            <a-select-option value="2">
              女
            </a-select-option>
            <a-select-option value="-1">
              未知
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户生日">
          <a-date-picker
            v-decorator="[
              'birthdayObj',
              { rules: [{ required: true, message: '请输入用户生日' }] },
            ]"
            placeholder="请输入用户生日"
            style="width: 100%;"
            :disabled="isDisable"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  add,
  getUser,
  update
} from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'
import { getRoleTree } from '@/api/system/role'
import { TreeSelect } from 'ant-design-vue'

const EmptyUserForm = {
  account: '',
  password: '',
  passwordAgain: '',
  name: '',
  realName: '',
  currentRoles: [],
  currentDepts: [],
  phone: '',
  email: '',
  sex: '',
  birthdayObj: moment('2018-01-01', 'YYYY-MM-DD')
}

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      const password = this.form.getFieldValue('password')
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      formVisible: false,
      deptData: [],
      roleData: [],
      /** *验证密码 */
      validatePass,
      validatePass2,
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      isDisable: false
    }
  },
  created() {
    this.loadDeptTree()
    this.loadRole()
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
          if (requestData.roleId) {
            requestData.currentRoles = requestData.roleId.split(',')
          }
          if (res.data.data.birthday) {
            requestData.birthdayObj = moment(res.data.data.birthday, 'YYYY-MM-DD HH:mm:ss')
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
    loadDeptTree() {
      getDeptTree().then(res => {
        this.deptData = res.data.data
      })
    },
    loadRole() {
      getRoleTree().then(res => {
        this.roleData = res.data.data
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
