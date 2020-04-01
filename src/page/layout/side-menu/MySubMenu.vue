<template>
  <a-sub-menu v-bind="$props" v-on="$listeners">
    <span slot="title">
      <a-icon :type="menuInfo.icon ? menuInfo.icon : defaultIcon" /><span>{{ menuInfo.name }}</span>
    </span>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.path">
        <a-icon :type="item.icon ? item.icon : defaultIcon" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" :default-icon="defaultIcon" />
    </template>
  </a-sub-menu>
</template>

<script>

import { Menu } from 'ant-design-vue'

export default {
  name: 'SubMenu',
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: { type: Object, required: true },
    defaultIcon: { type: String, default: 'mail' }
  }
}
</script>
