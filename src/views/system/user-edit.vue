<template>
  <div>
    <a-modal
      v-model="formVisible"
      width="65vw"
      :title="title"
      :mask-closable="false"
      :ok-button-props="{ props: {disabled: isDisable} }"
      :confirm-loading="spinning"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <a-form ref="form" :form="form" class="d2-col-form"
                :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                @submit="onSubmit"
        >
          <a-form-item label="登录账号">
            <a-input
              v-decorator="['account', { rules: [
                { required: true, message: '请输入登录账号' },
                { whitespace: true, message:'登录账号不能为空' }
              ]}]"
              placeholder="登录账号"
              :disabled="isDisable"
            />
          </a-form-item>
          <a-form-item label="用户姓名">
            <a-input
              v-decorator="['name', { rules: [
                { required: true, message: '请输入用户姓名' },
                { min: 2, max: 5, message: '姓名长度在2到5个字符' }
              ]}]"
              placeholder="请输入用户姓名"
              :disabled="isDisable"
            />
          </a-form-item>

          <template v-if="actionType === 'creation'">
            <a-form-item label="密码">
              <a-input-password
                v-decorator="['password', { rules: [
                  { required: true, validator: validatePass },
                  { pattern:/^[a-zA-Z]\w{5,17}$/, message: '以字母开头，长度在6~18之间' }
                ]}]"
                placeholder="请输入密码"
              />
            </a-form-item>
            <a-form-item v-if="actionType === 'creation'" label="确认密码">
              <a-input-password
                v-decorator="['passwordAgain', { rules: [
                  { required: true, validator: validatePass2 }
                ]}]"
                placeholder="请再次输入密码"
              />
            </a-form-item>
          </template>

          <a-form-item label="用户昵称">
            <a-input
              v-decorator="['realName', { rules: [
                { required: true, message: '请输入用户昵称' },
                { whitespace: true, message:'用户昵称不能为空' }
              ]}]"
              placeholder="请输入用户昵称"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item label="手机号">
            <a-input
              v-decorator="['phone', { rules: [
                { required: true, message: '请输入手机号' },
                { pattern:/^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码'}
              ]}]"
              placeholder="请输入手机号"
              type="phone"
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
              tree-default-expand-all
              tree-checkable
              tree-check-strictly
              :tree-data="roleList[0].children"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item ref="dept" label="所属部门">
            <a-tree-select
              v-decorator="[
                'currentDepts',
                { rules: [{ required: true, message: '请选择所属部门' }] },
              ]"
              placeholder="请选择所属部门"
              tree-default-expand-all
              tree-checkable
              tree-check-strictly
              :tree-data="deptList[0].children"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item label="电子邮箱" style="width: 100%;" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-input
              v-decorator="['email', { rules: [
                { required: true, message: '请输入电子邮箱' },
                { pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
              ]}]"
              placeholder="请输入电子邮箱"
              type="email"
              :disabled="isDisable"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/user-management'
import { ModelMixin } from '@/components/mixins/model-mixin'
import { mapGetters } from 'vuex'

const EmptyFormData = {
  account: '',
  name: '',
  realName: '',
  phone: '',
  currentRoles: [],
  currentDepts: [],
  email: ''
}

export default {
  name: 'UserEdit',
  mixins: [ModelMixin],
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
      /** 验证密码 */
      validatePass,
      validatePass2
    }
  },
  computed: {
    ...mapGetters(['deptList', 'roleList'])
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getById(id).then(res => {
          const requestData = res.data

          if (requestData.deptList && requestData.deptList.length > 0) {
            requestData.currentDepts = requestData.deptList.map(dept => ({
              label: dept.name,
              value: dept.id
            }))
          }
          if (requestData.roleList && requestData.roleList.length > 0) {
            requestData.currentRoles = requestData.roleList.map(role => ({
              label: role.name,
              value: role.id
            }))
          }

          const formData = {}

          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    /** 添加信息 */
    onInsert() {
      this.doInsert(add)
    },
    /** 修改信息 */
    onUpdate() {
      this.doUpdate(update)
    },
    getFormDataForInsert() {
      const formData = this.form.getFieldsValue()

      formData.deptIdList = formData.currentDepts.map(item => item.value)
      formData.roleIdList = formData.currentRoles.map(item => item.value)

      return formData
    },
    getFormDataForUpdate() {
      const formData = this.form.getFieldsValue()
      formData.id = this.id

      formData.deptIdList = formData.currentDepts.map(item => item.value)
      formData.roleIdList = formData.currentRoles.map(item => item.value)

      return formData
    }
  }
}
</script>
