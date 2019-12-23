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

        <a-form-item label="菜单排序">
          <a-input
            v-decorator="['sort', { rules: [{ required: true, message: '请输入菜单排序' }] }]"
            placeholder="请输入菜单排序"
            type="number"
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
  getDetail,
  update
} from '@/api/system/topmenu'
import { TreeSelect } from 'ant-design-vue'
import menuIconList from '@/config/menuIcon'

const EmptyUserForm = {
  name: '',
  code: '',
  source: '',
  sort: ''
}

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      title: '',
      actionType: 'creation',
      id: '',
      /** *信息展示的弹框 */
      formVisible: false,
      /** *Tree选择器 当父节点下所有子节点都选中时默认只显示子节点 */
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      isDisable: false,
      /** *菜单图标选择的弹框 */
      menuVisible: false,
      menuIconList: menuIconList
    }
  },
  created() {
  },
  methods: {
    open(type, id) {
      if (type === 'creation') {
        this.title = '添加信息'
        this.isDisable = false
      } else if (type === 'detail') {
        this.title = '查看信息'
        this.isDisable = true
      } else if (type === 'update') {
        this.title = '修改信息'
        this.isDisable = false
      } else {
        return
      }
      this.actionType = type
      this.formVisible = true

      if (id) {
        this.id = id
        getDetail(id).then(res => {
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
    openMenuModal() {
      this.menuVisible = true
    },
    onSubmit() {
      switch (this.actionType) {
        case 'creation':
          this.doCreation()
          break
        case 'update':
          this.doUpdate()
          break
        case 'detail':
        default:
          this.doDetail()
      }
    },
    onOk() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.onSubmit()
        } else {
          this.$message.error('校验失败！')
          console.error(errors, values)
        }
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    doDetail() {
      this.$emit('ok', this.actionType)
      this.formVisible = false
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
    },
    /** 菜单图标的点击事件 */
    onChangeMenu(v) {
      this.form.setFieldsValue({ source: v })
      this.menuVisible = false
    },
    /** 下拉弹层渲染节点固定在触发器的父元素中 */
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
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
