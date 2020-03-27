<template>
  <a-tree
    v-model="checkedKeys"
    :tree-data="treeData"
    checkable
    check-strictly
    default-expand-all
    @check="onCheck"
  />
</template>

<script>
import { conductCheck } from '@/util/antd-tree-util'

export default {
  name: 'TreeChecked',
  props: {
    defaultCheckedKeys: {
      type: Object,
      default: () => {
        return {
          checked: [],
          halfChecked: []
        }
      }
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      checkedKeys: {
        checked: [],
        halfChecked: []
      }
    }
  },
  computed: {
    parentCheckedKeys() {
      return this.defaultCheckedKeys
    }
  },
  watch: {
    defaultCheckedKeys: function(a) {
      this.checkedKeys = a
    }
  },
  created() {
    this.checkedKeys = this.parentCheckedKeys
  },
  methods: {
    onCheck(_, event) {
      const checked = event.checked
      const key = event.node.value

      const result = conductCheck([key], checked, this.treeData, {
        checkedKeys: this.checkedKeys.checked,
        halfCheckedKeys: this.checkedKeys.halfChecked
      })

      this.checkedKeys = {
        checked: [...result.checkedKeys, ...result.halfCheckedKeys],
        halfChecked: []
      }
      this.$emit('update:checkedKeys', this.checkedKeys)
      this.$emit('update:selectedData', [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked])
    }
  }

}
</script>

<style>

</style>
