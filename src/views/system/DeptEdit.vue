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

        <a-form-item label="上级部门">
          <a-tree-select
            v-decorator="['parentId']"
            allow-clear
            tree-default-expand-all
            placeholder="请选择上级部门，留空则为顶级父节点"
            :tree-data="deptTreeData"
            :disabled="isDisable"
            :get-popup-container="getPopupContainer"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
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
  sort: '',
  remark: '',
  parentId: null
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      /**  上级部门数据 */
      deptData: [],
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
          const nowDta = res.data
          const formData = {}

          if (nowDta.parentId === '0') {
            nowDta.parentId = null
          }

          Object.keys(EmptyUserForm).forEach(key => {
            formData[key] = nowDta[key]
          })

          console.log(formData)
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
        const found = this._findNode(currentId, treeData[i])
        if (found) {
          this._disableNode(found)
          break
        }
      }
    },
    _findNode(id, node) {
      if (node.id === id) {
        return node
      }

      if (node.children) {
        let found
        for (let i = 0; i < node.children.length; i++) {
          found = this._findNode(id, node.children[i])
          if (found) {
            return found
          }
        }
        return undefined
      }
    },
    _disableNode(node) {
      node.disabled = true
      if (node.children) {
        node.children.forEach(this._disableNode)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
