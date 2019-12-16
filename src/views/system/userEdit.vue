<template>
  <div>
    <a-modal
      :title="title"
      :visible.sync="formVisible"
      width="600px"
      @cancel="cancel"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="form"
      >
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="登录账号"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 19 }"
            >
              <a-input
                v-model="form.account"
                v-decorator="[
                  'form.account',
                  { rules: [{ required: true, message: '请输入登录账号' }] },
                ]"
                placeholder="登录账号"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="handleType=='add'" :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="密码"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="form.password"
                placeholder="请输入密码"
                type="password"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="确认密码"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="confirmPassword"
                placeholder="请再次输入密码"
                type="password"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="用户姓名:"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="form.name"
                placeholder="请输入用户姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="用户昵称"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="form.realName"
                placeholder="请输入用户昵称"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              ref="role"
              label="所属角色"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-tree-select
                v-model="currentRoles"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="roleData"
                placeholder="请选择所属角色"
                tree-default-expand-all
                tree-checkable
                :get-popup-container="getPopupContainer"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              ref="dept"
              label="所属部门"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-tree-select
                v-model="currentDepts"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="deptData"
                placeholder="请选择所属部门"
                tree-default-expand-all
                tree-checkable
                :get-popup-container="getPopupContainer"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="手机号"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="form.phone"
                placeholder="请输入手机号"
                type="phone"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="电子邮箱"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input
                v-model="form.email"
                placeholder="请输入电子邮箱"
                type="email"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="用户性别"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-select
                v-model="form.sex"
                placeholder="请输入用户性别"
              >
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
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="用户生日"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-date-picker
                v-model="birthdayObj"
                placeholder="请输入用户生日"
              />
            </a-form-item>
          </a-col>
        </a-row>
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
export default {
  props: {
    'recordId': {
      type: String,
      default: null
    },
    handleType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        account: '',
        name: '',
        realName: '',
        roleId: '',
        deptId: '',
        phone: '',
        operation: '',
        birthday: '',
        password: '',
        sex: '',
        email: ''
      },
      title: '',
      confirmPassword: '',
      formVisible: false,
      deptData: [],
      roleData: [],
      currentDepts: [],
      currentRoles: [],
      birthdayObj: moment('2018-01-01', 'YYYY-MM-DD')
    }
  },
  watch: {
    handleType (value) {
      if (value) {
        this.formVisible = true
      }
      if (this.handleType === 'add') {
        this.title = '添加信息'
        this.form = {}
      } else if (this.handleType === 'view') {
        this.title = '查看信息'
      } else if (this.handleType === 'edit') {
        this.title = '修改信息'
      }
    },
    recordId(id) {
      if (id) {
        getUser(id).then(res => {
          this.form = res.data.data
          this.form.sex = res.data.data.sex + ''
          if (this.form.deptId) {
            this.currentDepts = this.form.deptId.split(',')
          }
          if (this.form.roleId) {
            this.currentRoles = this.form.roleId.split(',')
          }
          if (res.data.data.birthday) {
            this.birthdayObj = moment(res.data.data.birthday, 'YYYY-MM-DD HH:mm:ss')
          }
        })
      }
    }
  },
  created() {
    this.loadDeptTree()
    this.loadRole()
  },
  methods: {
    loadDeptTree () {
      getDeptTree().then(res => {
        this.deptData = res.data.data
      })
    },
    loadRole () {
      getRoleTree().then(res => {
        this.roleData = res.data.data
      })
    },
    okHandle () {
      this[this.handleType] && this[this.handleType]()
      this.$emit('resetHandler')
    },
    cancel() {
      this.$emit('resetHandler')
      this.formVisible = false
    },
    add () {
      this.form.deptId = this.currentDepts.join(',')
      this.form.roleId = this.currentRoles.join(',')
      add(this.form).then(
        () => {
          this.$emit('fetchTableData')
          this.$message.success('操作成功!')
          this.formVisible = false
        },
        error => {
          console.log(error)
        }
      )
    },
    edit() {
      this.form.deptId = this.currentDepts.join(',')
      this.form.roleId = this.currentRoles.join(',')
      update(this.form).then(
        () => {
          this.$emit('fetchTableData')
          this.$message.success('操作成功!')
          this.formVisible = false
        },
        error => {
          console.log(error)
        }
      )
    },
    getPopupContainer(triggerNode) {
      return triggerNode
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
