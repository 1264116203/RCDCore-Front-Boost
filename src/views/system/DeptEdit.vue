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
        <a-form-item label="部门名称" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['deptName',{ rules: [{required: true,message: '请输入部门名称'}] }]"
            placeholder="请输入部门名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="部门全称" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['fullName', { rules: [{ required: true, message: '请输入部门全称' },{whitespace:true,message:'用户昵称不能为空'}] }]"
            placeholder="请输入部门全称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="上级部门">
          <a-tree-select
            v-decorator="['parentId', {rules: [{required: true, message: '请选择上级部门节点'}]}]"
            tree-default-expand-all
            placeholder="请选择上级部门，留空则为顶级父节点"
            :tree-data="clonedDeptTreeData"
            :disabled="isDisable"
            :get-popup-container="getPopupContainer"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          />
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number
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
            :disabled="isDisable"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="部门备注" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入备注"
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
  getDept,
  update
} from '@/api/system/dept'
import { ModelMixin } from '@/components/mixins/ModelMixin'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { disabledNode } from '@/util/tree'

const EmptyFormData = {
  deptName: '',
  fullName: '',
  sort: '100',
  remark: '',
  parentId: '0'
}

export default {
  mixins: [ModelMixin],
  data() {
    return {
      /** 原始数据的深拷贝，上级部门选择时设置当前节点的disable状态 */
      clonedDeptTreeData: []
    }
  },
  computed: {
    ...mapGetters(['deptList'])
  },
  created() {
    this.loadDeptTree()
  },
  methods: {
    open(type, id) {
      this.clonedDeptTreeData = cloneDeep(this.deptList)
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDept(id).then(res => {
          const nowDta = res.data
          const formData = {}
          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = nowDta[key]
          })

          this.form.setFieldsValue(formData)
        })

        /** 上级部门选择时设置当前节点是不可选 */
        disabledNode(this.id, this.clonedDeptTreeData)
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    loadDeptTree() {
      this.$store.dispatch('dept/getDeptData')
    },
    /** 添加信息 */
    onInsert() {
      this.doInsert(add).then(() => {
        this.$store.dispatch('dept/getDeptData')
      })
    },
    /** 修改信息 */
    onUpdate() {
      this.doUpdate(update).then(() => {
        this.$store.dispatch('dept/getDeptData')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
