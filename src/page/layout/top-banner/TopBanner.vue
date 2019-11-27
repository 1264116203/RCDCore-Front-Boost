<template>
  <div class="top-banner">
    <div class="top-banner-left">
      <span>
        <a-icon v-if="showCollapse"
                class="collapseButton"
                :type="isCollapse ? 'menu-unfold' : 'menu-fold'"
                @click="toggleCollapsed"
        />
      </span>
      <div class="quick-action">
        <a-dropdown>
          <span class="pointer"> <a-icon type="dashboard" /> 快捷操作</span>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="top-banner-right">
      <a-tooltip placement="bottom" title="锁屏">
        <div>
          <a-button type="link" class="right-button">
            <a-icon type="lock" theme="filled" />
          </a-button>
        </div>
      </a-tooltip>
      <a-tooltip placement="bottom" title="全屏切换">
        <div>
          <a-button type="link" class="right-button">
            <a-icon type="fullscreen" />
          </a-button>
        </div>
      </a-tooltip>

      <div class="pointer avatar-dropdown">
        <a-dropdown>
          <div style="display:inline-block; height: 3rem;">
            <a-avatar icon="user" style="margin-right: 0.5rem;" :size="32" />
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'TopBanner',
  computed: {
    ...mapState('common', ['isCollapse', 'showCollapse'])
  },
  methods: {
    ...mapMutations('common', ['TOGGLE_COLLAPSE']),
    toggleCollapsed() {
      this.TOGGLE_COLLAPSE()
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../custom-variables";

  .pointer {
    cursor: pointer;
  }

  .top-banner {
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;

    .top-banner-left {
      display: inline-flex;
      justify-items: center;

      .collapseButton {
        margin-left: 1rem;
        font-size: 1.2rem;
      }

      .quick-action {
        margin-left: 2em;
        margin-top: -0.125rem;
      }
    }

    .top-banner-right {
      display: inline-flex;
      justify-items: center;

      .right-button {
        font-size: 18px;
        color: @text-color;
        padding: 0 0.5rem;
      }

      .avatar-dropdown {
        margin-left: 0.5rem;
        margin-top: -0.125rem;
      }
    }
  }
</style>
