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
      <a-spin :spinning="spinning">
        <a-form ref="form" :form="form" class="d2-col-form"
                :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                @submit="onSubmit"
        >
          <a-form-item label="菜单名称">
            <a-input
              v-decorator="['name',{ rules: [{required: true,message: '请输入菜单名称'}] }]"
              placeholder="请输入菜单名称"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item label="路由地址">
            <a-input
              v-decorator="['path', { rules: [{ required: true, message: '请输入路由地址' }] }]"
              placeholder="请输入路由地址"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item label="菜单编码">
            <a-input
              v-decorator="[
                'code',
                { rules: [{
                  required: true,
                  message: '请输入菜单编码'
                }] },
              ]"
              placeholder="请输入菜单编码"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item label="菜单别名">
            <a-input
              v-decorator="['alias',{ rules: [{required: true,message: '请输入菜单别名'}] }]"
              placeholder="请输入菜单别名"
              :disabled="isDisable"
            />
          </a-form-item>

          <a-form-item ref="menu" label="上级菜单">
            <a-tree-select
              v-decorator="[ 'parentId' ]"
              :tree-data="clonedMenuTreeData"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              placeholder="请选择上级菜单"
              tree-default-expand-all
              :disabled="isDisable"
              :multiple="false"
            />
          </a-form-item>

          <a-form-item label="菜单图标">
            <a-input
              v-decorator="[
                'icon',
                { rules: [{
                  required: true,
                  message: '请输入菜单图标'
                }] },
              ]"
              placeholder="请输入菜单图标"
              :disabled="isDisable"
              @click="openMenuModal"
            />
          </a-form-item>

          <a-form-item label="菜单排序">
            <a-input-number
              v-decorator="['sort', { rules: [{ required: true, message: '请输入菜单排序' }] }]"
              placeholder="请输入菜单排序"
              :disabled="isDisable"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="菜单类型">
            <a-radio-group v-decorator="['category',{ rules: [{required: true,message: '请选择菜单类型'}] }]"
                           :disabled="isDisable"
            >
              <a-radio :value="1">
                菜单
              </a-radio>
              <a-radio :value="2">
                按钮
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="菜单备注" style="width: 100%" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-textarea
              v-decorator="['remark']"
              placeholder="请输入菜单备注"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :disabled="isDisable"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      v-model="menuVisible"
      title="请选择菜单图标"
    >
      <div class="icons-list">
        <a-tabs type="card">
          <a-tab-pane v-for="(item,index) in menuIconList" :key="index" :tab="item.label">
            <a-icon v-for="(_item,_index) in item.list" :key="_index" :type="_item" class="menu-icon" @click="onChangeMenu(_item)" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  add,
  getMenu,
  update
} from '@/api/system/menu'
import menuIconList from '@/config/menuIcon'
import { mapGetters } from 'vuex'
import { modelMixin } from '@/components/mixins/modelMixin'
import { cloneDeep } from 'lodash'
import { disabledNode } from '@/util/tree'

const EmptyFormData = {
  path: '',
  name: '',
  code: '',
  icon: 'check-circle',
  category: 1,
  alias: '',
  sort: '100',
  remark: '',
  parentId: '0'
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      /** *菜单图标选择的弹框 */
      menuVisible: false,
      menuIconList: menuIconList,
      MenuParentData: [],
      /** 原始数据的深拷贝，上级菜单选择时设置当前节点的disable状态 */
      clonedMenuTreeData: []
    }
  },
  computed: {
    ...mapGetters(['resourceList'])
  },
  created() {
    this.loadParentData()
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id

        const clonedTreeData = cloneDeep(this.resourceList)
        /** 上级菜单选择时设置当前节点是不可选 */
        disabledNode(this.id, clonedTreeData)
        this.clonedMenuTreeData = this.transformTreeData(clonedTreeData)

        getMenu(id).then(res => {
          const requestData = res.data

          const formData = {}

          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.clonedMenuTreeData = this.transformTreeData(cloneDeep(this.resourceList))
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    openMenuModal() {
      this.menuVisible = true
    },
    loadParentData() {
      this.spinning = true
      return this.$store.dispatch('resource/getTree')
        .then(() => {
          const clonedTreeData = cloneDeep(this.resourceList)
          if (this.id) {
            /** 上级菜单选择时设置当前节点是不可选 */
            disabledNode(this.id, clonedTreeData)
          }
          this.clonedMenuTreeData = this.transformTreeData(clonedTreeData)
        })
        .finally(() => { this.spinning = false })
    },
    /** *添加信息 */
    onInsert() {
      this.doInsert(add).then(() => {
        this.$store.dispatch('resource/getTree')
      })
    },
    /** *修改信息 */
    onUpdate() {
      this.doUpdate(update).then(() => {
        this.$store.dispatch('resource/getTree')
      })
    },
    /** 菜单图标的点击事件 */
    onChangeMenu(v) {
      this.form.setFieldsValue({ icon: v })
      this.menuVisible = false
    },
    /** Tree 下拉选的数据格式 */
    transformTreeData(data) {
      function transform(data) {
        if (data.children) {
          data.children = data.children.map(transform)
        }
        return {
          children: data.children,
          title: data.name,
          key: data.id,
          value: data.id,
          disabled: data.disabled
        }
      }
      return data.map(transform)
    }
  }
}
</script>
