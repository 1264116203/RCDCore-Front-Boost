<template>
  <div :class="{noMargin: noMargin, noPadding: noPadding}" class="rcd-flow-wrapper">
    <div :class="{flex: flex}" :style="bodyStyleObj" class="rcd-flow-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RcdFlowContainer',
  props: {
    noMargin: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    flex: {
      type: Boolean,
      default: false
    },
    justify: {
      type: String,
      default: ''
    },
    alignItem: {
      type: String,
      default: ''
    }
  },
  computed: {
    bodyStyleObj() {
      const obj = {}
      if (this.justify) {
        obj.justifyContent = this.justify
      }
      if (this.alignItem) {
        obj.alignItems = this.alignItem
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
  .rcd-flow-wrapper {
    width: 100%;
    padding: 1rem 0;
    margin-bottom: 1rem;

    .rcd-flow-container {
      max-width: 1200px;
      width: 100%;
      margin: auto;
    }
  }

  .noMargin {
    margin: 0;
  }

  .noPadding {
    padding: 0;
  }

  .flex {
    display: flex;
  }
</style>
