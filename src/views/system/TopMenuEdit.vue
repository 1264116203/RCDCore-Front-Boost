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

        <a-form-item label="菜单图标">
          <a-input
            v-decorator="[
              'source',
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
  getDetail,
  update
} from '@/api/system/topmenu'
import { TreeSelect } from 'ant-design-vue'
import menuIconList from '@/config/menuIcon'
import { modelMixin } from '@/components/mixins/modelMixin'

const EmptyFormData = {
  name: '',
  code: '',
  source: 'check-circle',
  sort: '100'
}

export default {
  mixins: [modelMixin],
  data() {
    return {
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      /** *菜单图标选择的弹框 */
      menuVisible: false,
      menuIconList: menuIconList
    }
  },
  created() {
  },
  methods: {
    open(type, id) {
      this.modelTitle(type)

      if (id) {
        this.id = id
        getDetail(id).then(res => {
          const requestData = res.data

          const formData = {}

          Object.keys(EmptyFormData).forEach(key => {
            formData[key] = requestData[key]
          })

          this.form.setFieldsValue(formData)
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...EmptyFormData })
        })
      }
    },
    openMenuModal() {
      this.menuVisible = true
    },
    /** *添加信息 */
    onInsert() {
      this.doInsert(add)
    },
    /** *修改信息 */
    onUpdate() {
      this.doUpdate(update)
    },
    /** 菜单图标的点击事件 */
    onChangeMenu(v) {
      this.form.setFieldsValue({ source: v })
      this.menuVisible = false
    }
  }
}
</script>
