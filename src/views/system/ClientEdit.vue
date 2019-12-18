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
        <a-form-item label="应用id">
          <a-input
            v-decorator="['clientId',{ rules: [{required: true,message: '请输入客户端id'}] }]"
            placeholder="请输入客户端id"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="应用密钥">
          <a-input
            v-decorator="['clientSecret', { rules: [{ required: true, message: '请输入客户端密钥' }] }]"
            placeholder="请输入客户端密钥"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="授权类型">
          <a-input
            v-decorator="['authorizedGrantTypes', { rules: [{ required: true, message: '请输入授权类型' }] }]"
            placeholder="请输入授权类型"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="授权范围">
          <a-input
            v-decorator="['scope', { rules: [{ required: true, message: '请输入授权范围' }] }]"
            placeholder="请输入授权范围"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="令牌秒数">
          <a-input
            v-decorator="['accessTokenValidity', { rules: [{ required: true, message: '请输入令牌过期秒数' }] }]"
            placeholder="请输入令牌过期秒数"
            type="number"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="刷新秒数">
          <a-input
            v-decorator="['refreshTokenValidity',{ rules: [{required: true,message: '请输入刷新令牌过期秒数'}] }]"
            placeholder="请输入刷新令牌过期秒数"
            type="number"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="回调地址">
          <a-input
            v-decorator="['webServerRedirectUri', { rules: [{ required: true, message: '请输入回调地址' }] }]"
            placeholder="请输入回调地址"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="资源集合">
          <a-input
            v-decorator="['resourceIds']"
            placeholder="请输入资源集合"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="权限">
          <a-input
            v-decorator="['authorities']"
            placeholder="请输入权限"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="自动授权">
          <a-input
            v-decorator="['autoapprove']"
            placeholder="请输入自动授权"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="附加说明" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['additionalInformation']"
            placeholder="请输入附加说明"
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
  update,
  getDetail
} from '@/api/system/client'

const EmptyUserForm = {
  clientId: '',
  clientSecret: '',
  authorizedGrantTypes: '',
  scope: '',
  accessTokenValidity: '',
  refreshTokenValidity: '',
  webServerRedirectUri: '',
  resourceIds: '',
  authorities: '',
  autoapprove: '',
  additionalInformation: ''
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
        getDetail(id).then(res => {
          const requestData = res.data.data

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
    openMenuModal() {
      this.menuVisible = true
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
  .menu-icon{
    width: 20px;
    height: 20px;
    margin: 10px;
    font-size: 14px;
    text-align: center;
    line-height: 25px;
  }

  .menu-icon:hover{
    background-color: aqua;
    color: white;
  }
</style>
