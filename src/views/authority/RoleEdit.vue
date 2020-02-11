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
            :tree-data="clonedRoleTreeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级角色"
            tree-default-expand-all
            :disabled="isDisable"
            :multiple="false"
          />
        </a-form-item>

        <a-form-item label="角色排序">
          <a-input-number
            v-decorator="['sort', { rules: [{ required: true, message: '请输入角色排序' }] }]"
            placeholder="请输入角色排序"
            :disabled="isDisable"
            style="width: 100%"
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
import { ModelMixin } from '@/components/mixins/ModelMixin'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { disabledNode } from '@/util/tree'

const EmptyFormData = {
  roleName: '',
  roleAlias: '',
  parentId: '0',
  sort: '100'
}

export default {
  mixins: [ModelMixin],
  data() {
    return {
      /** 原始数据的深拷贝，上级角色选择时设置当前节点的disable状态 */
      clonedRoleTreeData: []
    }
  },
  computed: {
    ...mapGetters(['roleList'])
  },
  created() {
    this.loadParentData()
  },
  methods: {
    open(type, id) {
      this.clonedRoleTreeData = cloneDeep(this.roleList)
      this.modelTitle(type)

      if (id) {
        this.id = id
        getRole(id).then(res => {
          const requestData = res.data

          const formData = {}

          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
        /** 上级角色选择时设置当前节点是不可选 */
        disabledNode(this.id, this.clonedRoleTreeData)
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    loadParentData() {
      this.$store.dispatch('role/getTree')
    },
    /** 添加信息 */
    onInsert() {
      this.doInsert(add).then(() => {
        this.$store.dispatch('role/getTree')
      })
    },
    /** 修改信息 */
    onUpdate() {
      this.doUpdate(update).then(() => {
        this.$store.dispatch('role/getTree')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
