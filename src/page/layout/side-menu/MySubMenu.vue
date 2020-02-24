<template functional>
  <a-sub-menu v-if="props.menuInfo.children && props.menuInfo.children.length > 0" :key="props.menuInfo.path">
    <span slot="title">
      <a-icon :type="props.menuInfo.icon ? props.menuInfo.icon : props.defaultIcon" />
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children || item.children.length === 0"
                   :key="item.path"
      >
        <a-icon :type="item.icon ? item.icon : props.defaultIcon" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <my-sub-menu v-else :key="item.path" :menu-info="item" :default-icon="props.defaultIcon" />
    </template>
  </a-sub-menu>
  <a-menu-item v-else :key="props.menuInfo.path">
    <a-icon :type="props.menuInfo.icon ? props.menuInfo.icon : props.defaultIcon" />
    <span>{{ props.menuInfo.name }}</span>
  </a-menu-item>
</template>

<script>

export default {
  functional: true,
  props: {
    menuInfo: { type: Object, required: true },
    defaultIcon: { type: String, required: true }
  }
}
</script>
