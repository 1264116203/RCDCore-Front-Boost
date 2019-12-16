<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="600px"
      :title="title"
      :mask-closable="false"
      @cancel="onCancel"
    >
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @submit="onSubmit">
        <a-form-item label="登录账号">
          <a-input
            v-decorator="[
              'account',
              { rules: [{ required: true, message: '请输入登录账号' }] },
            ]"
            placeholder="登录账号"
          />
        </a-form-item>

        <a-form-item v-show="actionType === 'creation'" label="密码">
          <a-input v-decorator="['password']" placeholder="请输入密码" type="password" />
        </a-form-item>
        <a-form-item v-show="actionType === 'creation'" label="确认密码">
          <a-input v-decorator="['passwordAgain']" placeholder="请再次输入密码" type="password" />
        </a-form-item>

        <a-form-item label="用户姓名">
          <a-input v-decorator="['name']" placeholder="请输入用户姓名" />
        </a-form-item>

        <a-form-item label="用户昵称">
          <a-input v-decorator="['realName']" placeholder="请输入用户昵称" />
        </a-form-item>

        <a-form-item ref="role" label="所属角色">
          <a-tree-select
            v-decorator="['currentRoles']"
            placeholder="请选择所属角色"
            :tree-data="roleData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            tree-default-expand-all
            tree-checkable
          />
        </a-form-item>

        <a-form-item ref="dept" label="所属部门">
          <a-tree-select
            v-decorator="['currentDepts']"
            :tree-data="deptData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择所属部门"
            tree-default-expand-all
            tree-checkable
          />
        </a-form-item>

        <a-form-item label="手机号">
          <a-input v-decorator="['phone']" placeholder="请输入手机号" type="phone" />
        </a-form-item>

        <a-form-item label="电子邮箱">
          <a-input v-decorator="['email']" placeholder="请输入电子邮箱" type="email" />
        </a-form-item>

        <a-form-item label="用户性别">
          <a-select v-decorator="['sex']" placeholder="请输入用户性别">
            <a-select-option value="1">
              男
            </a-select-option>
            <a-select-option value="2">
              女
            </a-select-option>
            <a-select-option value="3">
              未知
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户生日">
          <a-date-picker v-decorator="['birthdayObj']" placeholder="请输入用户生日" style="width: 100%;" />
        </a-form-item>
      </a-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <a-button @click="cancel">
          取 消
        </a-button>
        <a-button
          v-if="handleType!='view'"
          type="primary"
          @click="okHandle"
        >
          确 定
        </a-button>
      </div>
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
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      formVisible: false,
      deptData: [],
      roleData: []
    }
  },
  created() {
    this.loadDeptTree()
    this.loadRole()
  },
  methods: {
    open(type, id) {
      if (type === 'create') {
        this.title = '添加信息'
      } else if (type === 'detail') {
        this.title = '查看信息'
      } else if (type === 'update') {
        this.title = '修改信息'
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
    onCancel() {
      this.$emit('cancel')
    },
    doDetail() {
      this.$emit('ok', this.actionType)
      this.formVisible = false
    },
    doCreation() {
      const formData = this.form.getFieldsValue()

      formData.deptId = this.currentDepts.join(',')
      formData.roleId = this.currentRoles.join(',')
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

      formData.deptId = this.currentDepts.join(',')
      formData.roleId = this.currentRoles.join(',')
      update(formData)
        .then(() => {
          this.$emit('ok', this.actionType, formData)
          this.$message.success('操作成功!')
          this.formVisible = false
        })
        .catch(error => { this.$message.error(error) })
    },
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    }
  }
}
</script>

<style scoped>
</style>
