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
        <a-form-item label="字典编号" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            v-decorator="['code',{ rules: [{required: true,message: '请输入字典编号'}] }]"
            placeholder="请输入字典编号"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典名称">
          <a-input
            v-decorator="['dictValue', { rules: [{ required: true, message: '请输入字典名称' }] }]"
            placeholder="请输入字典名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="dict" label="上级字典">
          <a-tree-select
            v-decorator="[ 'parentId' ]"
            :tree-data="clonedDictTreeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级字典"
            tree-default-expand-all
            :disabled="isDisable"
            :multiple="false"
          />
        </a-form-item>

        <a-form-item label="字典键值">
          <a-input
            v-decorator="['dictKey', { rules: [{ required: true, message: '请输入字典键值' }] }]"
            placeholder="请输入字典键值"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典排序">
          <a-input-number
            v-decorator="['sort', { rules: [{ required: true, message: '请输入字典排序' }] }]"
            placeholder="请输入字典排序"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="字典备注" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入字典备注"
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
  getDict,
  update
} from '@/api/system/dict'
import { modelMixin } from '@/components/mixins/modelMixin'
import { mapGetters } from 'vuex'
import { disabledNode } from '@/util/tree'
import { cloneDeep } from 'lodash'

const EmptyUserForm = {
  code: '',
  dictValue: '',
  parentId: '',
  dictKey: '',
  sort: '',
  remark: ''
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      /** 原始数据的深拷贝，上级字典选择时设置当前节点的disable状态 */
      clonedDictTreeData: []
    }
  },
  computed: {
    ...mapGetters(['dictList'])
  },
  created() {
    this.loadParentData()
  },
  methods: {
    open(type, id) {
      this.clonedDictTreeData = cloneDeep(this.dictList)
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDict(id).then(res => {
          const requestData = res.data

          if (requestData.deptId) {
            requestData.currentDepts = requestData.deptId.split(',')
          }
          const formData = {}

          Object.keys(EmptyUserForm).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
        /** 上级部门选择时设置当前节点是不可选 */
        disabledNode(this.id, this.clonedDictTreeData)
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyUserForm })
        })
      }
    },
    loadParentData() {
      this.$store.dispatch('dict/getTree')
    },
    /** 添加信息 */
    doCreation() {
      this.addHandle(add).then(() => {
        this.$store.dispatch('dict/getTree')
      })
    },
    /** 修改信息 */
    doUpdate() {
      this.updateHandle(update).then(() => {
        this.$store.dispatch('dict/getTree')
      })
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
