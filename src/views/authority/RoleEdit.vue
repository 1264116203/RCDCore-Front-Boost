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
              :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }"
              @submit="onSubmit"
      >
        <a-form-item label="角色名称">
          <a-input
            v-decorator="['roleName',{ rules: [{required: true,message: '请输入角色名称'}] }]"
            placeholder="请输入角色名称"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="角色别名">
          <a-input
            v-decorator="['roleAlias', { rules: [{ required: true, message: '请输入角色别名' }] }]"
            placeholder="请输入角色别名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item ref="role" label="上级角色">
          <a-tree-select
            v-decorator="[ 'parentId' ]"
            :tree-data="RoleParentData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级角色"
            tree-default-expand-all
            :show-checked-strategy="SHOW_PARENT"
            :disabled="isDisable"
            :multiple="false"
          />
        </a-form-item>

        <a-form-item label="角色排序">
          <a-input
            v-decorator="['sort', { rules: [{ required: true, message: '请输入角色排序' }] }]"
            placeholder="请输入角色排序"
            type="number"
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
  getRole,
  getRoleTree
} from '@/api/system/role'
import { TreeSelect } from 'ant-design-vue'
import { modelMixin } from '@/components/mixins/modelMixin'

const EmptyUserForm = {
  roleName: '',
  roleAlias: '',
  parentId: '',
  sort: ''
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      RoleParentData: [],
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT
    }
  },
  created() {
    this.loadParentData()
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getRole(id).then(res => {
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
    loadParentData() {
      getRoleTree().then(res => {
        this.RoleParentData = res.data
      })
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

</style>
