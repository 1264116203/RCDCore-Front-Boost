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
      <a-form ref="form" :form="form" class="d2-col-form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @submit="onSubmit">
        <a-form-item label="机构名称">
          <a-input
            v-decorator="['deptName',{ rules: [{required: true,message: '请输入机构名称'}] }]"
            placeholder="请输入机构名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="机构全称">
          <a-input
            v-decorator="['fullName', { rules: [{ required: true, message: '请输入机构全称' },{whitespace:true,message:'用户昵称不能为空'}] }]"
            placeholder="请输入机构全称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="上级机构">
          <a-tree-select
            v-decorator="['parentId',{ rules: [{ required: true, message: '请选择上级机构' }] }]"
            placeholder="请选择上级机构"
            :tree-data="deptData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            tree-default-expand-all
            tree-checkable
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="排序">
          <a-input
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
            type="number"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="备注">
          <a-input
            v-decorator="['remark', { rules: [{ required: true, message: '请输入备注'}] }]"
            placeholder="请输入备注"
            type="email"
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
  update,
  getDeptTree
} from '@/api/system/dept'
import { TreeSelect } from 'ant-design-vue'
import { modelMixin } from '@/components/mixins/modelMixin'

const EmptyUserForm = {
  deptName: '',
  fullName: '',
  select: '',
  sort: '',
  remark: ''
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      deptData: [],
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT
    }
  },
  created() {
    this.loadDeptTree()
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDept(id).then(res => {
          const requestData = res.data
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
        this.deptData = res.data
      })
    },
    /** *添加信息 */
    doCreation() {
      this.addHandle(add)
    },
    /** *修改信息 */
    doUpdate() {
      this.updataHandle(update)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
