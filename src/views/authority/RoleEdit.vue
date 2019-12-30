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
          <a-input-number
            v-decorator="['sort', { rules: [{ required: true, message: '请输入角色排序' }] }]"
            placeholder="请输入角色排序"
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
  getRole
} from '@/api/system/role'
import { TreeSelect } from 'ant-design-vue'
import { modelMixin } from '@/components/mixins/modelMixin'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'

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
      /** Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      /** 上级角色选择时设置当前节点 */
      RoleParentData: []
    }
  },
  computed: {
    ...mapGetters(['RoleParentList'])
  },
  created() {
    this.loadParentData()
  },
  methods: {
    open(type, id) {
      this.RoleParentData = cloneDeep(this.RoleParentList)
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
        /** 上级部门选择时设置当前节点是不可选 */
        this.disabledNode(this.id, this.RoleParentData)
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyUserForm })
        })
      }
    },
    loadParentData() {
      this.$store.dispatch('role/getRoleParentData')
    },
    /** 添加信息 */
    doCreation() {
      this.addHandle(add).then(() => {
        this.$store.dispatch('role/getRoleParentData')
      })
    },
    /** 修改信息 */
    doUpdate() {
      this.updataHandle(update).then(() => {
        this.$store.dispatch('role/getRoleParentData')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
