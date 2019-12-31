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

        <a-form-item ref="menu" label="上级菜单">
          <a-tree-select
            v-decorator="[ 'parentId' ]"
            :tree-data="MenuParentData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :get-popup-container="getPopupContainer"
            placeholder="请选择上级菜单"
            tree-default-expand-all
            :show-checked-strategy="SHOW_PARENT"
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

        <a-form-item label="菜单编号">
          <a-input
            v-decorator="[
              'code',
              { rules: [{
                required: true,
                message: '请输入菜单编号'
              }] },
            ]"
            placeholder="请输入菜单编号"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单类型">
          <a-radio-group v-decorator="['category',{ rules: [{required: true,message: '请选择菜单类型'}] }]" :disabled="isDisable">
            <a-radio :value="1">
              菜单
            </a-radio>
            <a-radio :value="2">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="菜单别名">
          <a-input
            v-decorator="['alias',{ rules: [{required: true,message: '请输入菜单别名'}] }]"
            placeholder="请输入菜单别名"
            :disabled="isDisable"
          />
        </a-form-item>

        <a-form-item label="菜单排序">
          <a-input
            v-decorator="['sort', { rules: [{ required: true, message: '请输入菜单排序' }] }]"
            placeholder="请输入菜单排序"
            type="number"
            :disabled="isDisable"
          />
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
  update,
  getRoutes
} from '@/api/system/menu'
import { TreeSelect } from 'ant-design-vue'
import menuIconList from '@/config/menuIcon'
import { modelMixin } from '@/components/mixins/modelMixin'

const EmptyUserForm = {
  path: '',
  name: '',
  code: '',
  icon: '',
  category: '',
  alias: '',
  sort: '',
  remark: '',
  parentId: '',
  parentName: ''
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      /** *菜单图标选择的弹框 */
      menuVisible: false,
      menuIconList: menuIconList,
      MenuParentData: []
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
        getMenu(id).then(res => {
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
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyUserForm })
        })
      }
    },
    openMenuModal() {
      this.menuVisible = true
    },
    loadParentData() {
      getRoutes().then(res => {
        this.MenuParentData = this.handlerTreeData(res.data)
      })
    },
    /** *添加信息 */
    doCreation() {
      this.addHandle(add)
    },
    /** *修改信息 */
    doUpdate() {
      this.updateHandle(update)
    },
    /** 菜单图标的点击事件 */
    onChangeMenu(v) {
      this.form.setFieldsValue({ icon: v })
      this.menuVisible = false
    },
    /** Tree 下拉选的数据格式 */
    handlerTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].title = data[i].name
        data[i].key = data[i].id
        data[i].value = data[i].id
        if (data[i].children && data[i].children.length > 0) {
          this.handlerTreeData(data[i].children)
        }
      }
      return data
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
  .menu-icon{
    width: 20px;
    height: 20px;
    margin: 10px;
    font-size: 14px;
    text-align: center;
    line-height: 25px;
  }

  .menu-icon:hover{
    background-color: aqua;
    color: white;
  }
</style>
