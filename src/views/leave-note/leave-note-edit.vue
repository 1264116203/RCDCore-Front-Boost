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
        label="请假条id" prop="id"
        :rules="[{ required: false, message: 'id' }]"
      >
        <a-input
          v-model="formData.id"
          :disabled="disable"
          placeholder="请输入请假人姓名"
        />
      </a-form-model-item>
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
        <a-select v-model="formData.approverState" :size="size" default-value="未审核"
                  style="width: 200px" @change="handleChange"
        >
          <a-select-option v-for="i in approverStates" :key="i.value">
            {{ i.states }}
          </a-select-option>
        </a-select>
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
    this.approverState = '0'
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
      approverStates: [{ value: 0, states: '未审核' }, { value: 1, states: '通过' }, { value: 2, states: '未通过' }],
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
     * 缺省的修改记录处理
     *
     * 自带一系列默认行为，如管理对话框加载状态等
     * 如果不符合需求可以重写
     */
    async commonUpdate() {
      this.spinning = true
      const formData = this.getFormDataForUpdate()
      formData.leaveStart = moment(formData.leaveStart).valueOf()
      formData.leaveEnd = moment(formData.leaveEnd).valueOf()
      formData.submitTime = moment(formData.submitTime).valueOf()
      try {
        await this.axiosUpdate(formData)
        this.$emit('ok', this.actionType, formData)
        this.$message.success('数据更新成功!')
        this.formVisible = false
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
