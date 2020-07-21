<template>
  <!-- 岗位选择对话框 -->
  <a-modal
    v-model="modelVisible"
    :title="title"
    :mask-closable="false"
    @ok="onOk"
    @close="reset"
  >
    <div style="height: 50vh;min-height: 300px;overflow-y: auto">
      <a-tree
        v-model="checked"
        :tree-data="copiedMenuTree"
        checkable
        check-strictly
        default-expand-all
      />
    </div>
  </a-modal>
</template>

<script>
import { deepSearch } from '@/util/tree'
import { deepClone } from '@/util/util'
import { mapGetters } from 'vuex'

export default {
  name: 'DeptCheckTreeModal',
  props: {
    title: { type: String, default: '岗位选择' }
  },
  data() {
    return {
      modelVisible: false,
      callback: null,
      copiedMenuTree: [],
      checked: {
        checked: []
      }
    }
  },
  computed: {
    ...mapGetters('dept', ['deptIdNameMap']),
    menuTree() {
      return this.$store.state.dept.deptData
    }
  },
  methods: {
    open(openRequest) {
      this.copiedMenuTree = deepClone(this.menuTree)
      this.checked = {
        checked: openRequest.checked
      }

      if (openRequest.disabled) {
        openRequest.disabled.forEach(id => {
          const found = deepSearch(this.copiedMenuTree, id, 'id')
          if (found) {
            this.$set(found, 'disabled', true)
          }
        })
      }

      this.callback = openRequest.callback
      this.modelVisible = true
    },
    onOk() {
      if (this.callback) {
        const deptList = this.checked.checked.map(id => ({ id, name: this.deptIdNameMap.get(id) }))
        this.callback(deptList)
        this.reset()
      }
      this.modelVisible = false
    },
    reset() {
      this.callback = null
      this.copiedMenuTree = []
      this.checked = {
        checked: []
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
