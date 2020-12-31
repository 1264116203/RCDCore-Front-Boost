<template>
  <a-modal
    v-model="formVisible"
    :title="title"
    :mask-closable="false"
    :after-close="reset"
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-form-model ref="form" :model="formData" layout="vertical">
      <a-form-model-item
        v-show="false"
        label="请假人姓名" prop="realName"
        :rules="[{ required: false, message: '请输入请假人姓名' }]"
      >
        <a-input
          v-model="formData.realName"
          :disabled="disable"
          placeholder="请输入请假人姓名"
        />
      </a-form-model-item>
      <a-form-model-item
        label="请假时间起" prop="leaveStart"
        :rules="[{ required: true, message: '请输入请假时间起' }]"
      >
        <a-date-picker
          v-model="formData.leaveStart"
          :show-time="{ format: 'HH:mm' }"
          :disabled="disable"
          style="width: 100%;"
          allow-clear
          placeholder="请选择请假时间起"
        />
        {{ formData.leaveStart }}
      </a-form-model-item>
      <a-form-model-item
        label="请假时间止" prop="leaveEnd"
        :rules="[{ required: true, message: '请输入请假时间止' }]"
      >
        <a-date-picker
          v-model="formData.leaveEnd"
          :show-time="{ format: 'HH:mm' }"
          :disabled="disable"
          style="width: 100%;"
          allow-clear
          placeholder="请选择请假时间止"
        />
        {{ formData.leaveEnd }}
      </a-form-model-item>
      <a-form-model-item
        v-show="isDisplay" label="提交时间"
        prop="submitTime"
        :rules="[{ required: false, message: '请输入提交时间' }]"
      >
        <a-date-picker
          v-model="formData.submitTime"
          :show-time="{ format: 'HH:mm' }"
          :disabled="disable"
          style="width: 100%;"
          allow-clear
          placeholder="请选择提交时间"
        />
        {{ formData.submitTime }}
      </a-form-model-item>
      <a-form-model-item
        label="请假事由" prop="leaveReason"
        :rules="[{ required: false, message: '请输入请假事由' }]"
      >
        <a-input
          v-model="formData.leaveReason"
          :disabled="disable"
          placeholder="请输入请假事由"
        />
      </a-form-model-item>
      <a-form-model-item
        v-show="isDisplay"

        label="审批状态" prop="approverState"
        :rules="[{ required: false, message: '请输入审批状态' }]"
      >
        <a-input-number
          v-model="formData.approverState"
          :setp="1"
          :min="0"
          :max="100"
          style="width: 100%;"
          allow-clear
          placeholder="请输入审批状态"
        />
      </a-form-model-item>
      <a-form-model-item
        v-show="isDisplay"

        label="审批意见" prop="approverOpinion"
        :rules="[{ required: false, message: '请输入审批意见' }]"
      >
        <a-input
          v-model="formData.approverOpinion"
          placeholder="请输入审批意见"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {
  add,
  update,
  getById
} from '@/api/leave-note/leave-note'
import { ModelMixin } from '@/components/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 请假人姓名 */
    this.realName = ''
    /** 请假时间起 */
    this.leaveStart = null
    /** 请假时间止 */
    this.leaveEnd = null
    /** 提交时间 */
    this.submitTime = null
    /** 请假事由 */
    this.leaveReason = ''
    /** 审批者 */
    this.approver = ''
    /** 审批状态 */
    this.approverState = null
    /** 审批意见 */
    this.approverOpinion = ''
    /** 审批时间 */
    this.approverTime = null
  }
}

export default {
  name: 'LeaveNoteEdit',
  mixins: [ModelMixin],
  data() {
    return {
      // 使用角色权限控制是否显示
      isDisplay: false,
      // 角色列表
      roleList: [],
      // 使用角色权限控制是否可以更改
      disable: false
    }
  },
  created() {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getById,
      axiosAdd: add,
      axiosUpdate: update
    })

    this.roleList = JSON.parse(localStorage.getItem('RCDCore-userInfo')).content.roleList
    // eslint-disable-next-line no-unused-vars
    this.isDisplay = this.roleList.filter(e => {
      return e.roleAlias === 'minister'
    }).length > 0

    this.disable = this.isDisplay
  },
  methods: {

    /**
     * 根据id拉取服务器数据
     *
     * 如果不符合需求可以重写本方法
     * @return {Promise<void>}
     */
    async getRecordById() {
      this.spinning = true
      try {
        const formData = (await this.axiosGetById(this.id)).data
        formData.leaveStart = moment(formData.leaveStart)
        formData.leaveEnd = moment(formData.leaveEnd)
        formData.submitTime = moment(formData.submitTime)
        this.formData = formData
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
    },
    /**
     * 生成添加数据时要使用的数据
     *
     * 默认直接传入this.formData
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForCreation() {
      this.formData.leaveStart = moment(this.formData.leaveStart).valueOf()
      this.formData.leaveEnd = moment(this.formData.leaveEnd).valueOf()
      const formData = ({ ...this.formData })
      for (const key of Object.keys(formData)) {
        if (key.endsWith('Time') && formData[key] && formData[key].valueOf) {
          formData[key] = formData[key].valueOf()
        }
      }
      console.log('执行了getFormDataForCreation方法')
      return formData
    },
    /**
     * 生成更新数据时要使用的数据
     *
     * 默认直接传入this.formData + this.id
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForUpdate() {
      const formData = {
        id: this.id,
        ...this.formData
      }
      for (const key of Object.keys(formData)) {
        if (key.endsWith('Time') && formData[key] && formData[key].valueOf) {
          formData[key] = formData[key].valueOf()
        }
      }
      console.log('执行了 getFormDataForUpdate 方法')

      return formData
    }
  }
}
</script>

<style lang="less" scoped>

</style>
