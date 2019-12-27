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
        <a-form-item label="部门名称">
          <a-input
            v-decorator="['deptName',{ rules: [{required: true,message: '请输入部门名称'}] }]"
            placeholder="请输入部门名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="部门全称">
          <a-input
            v-decorator="['fullName', { rules: [{ required: true, message: '请输入部门全称' },{whitespace:true,message:'用户昵称不能为空'}] }]"
            placeholder="请输入部门全称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="上级部门">
          <a-tree-select
            v-decorator="['parentId']"
            placeholder="请选择上级部门，不选默认顶级父节点"
            :tree-data="deptTreeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            tree-default-expand-all
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
            v-decorator="['remark']"
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
import { modelMixin } from '@/components/mixins/modelMixin'
import { cloneDeep } from 'lodash'

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
      /**  上级部门数据 */
      deptData: [],
      nowDta: [],
      /**  上级部门选择时设置当前节点 */
      deptTreeData: []
    }
  },
  created() {
    this.loadDeptTree()
  },
  methods: {
    open(type, id) {
      this.deptTreeData = cloneDeep(this.deptData)
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDept(id).then(res => {
          this.nowDta = res.data
          const formData = {}

          Object.keys(EmptyUserForm).forEach(key => {
            formData[key] = this.nowDta[key]
          })

          this.form.setFieldsValue(formData)
        })

        /**  上级部门选择时设置当前节点是不可选 */
        this.disabledNode(this.id, this.deptTreeData)
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
    },
    /** *设置Tree当前节点和自己子节点不可选 */
    disabledNode(currentId, treeData) {
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === currentId) {
          treeData[i].disabled = true
          if (treeData[i].children && treeData[i].children.length > 0) {
            treeData[i].children.forEach((item) => {
              this.disabledNode(item.id, treeData[i].children)
            })
          }
        } else {
          // 没找的时候你继续找currentId
          if (treeData[i].children && treeData[i].children.length > 0) {
            treeData[i].children.forEach((item) => {
              this.disabledNode(currentId, treeData[i].children)
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
