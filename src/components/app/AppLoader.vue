<template>
  <div class="app-loader" :style="style">
    <div class="app-loader-container">
      <img src="/favicon/logo-light.svg" class="loader-app-logo-light" :style="style"/>
    </div>
    <div class="app-loader-container main">
      <img src="/favicon/logo.svg" class="loader-app-loader-main" :style="style"/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    size: {
      default: 64,
    },
  },
  setup(props) {
    const style = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
    }))

    return {
      style,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-loader {
  position: relative;

  @keyframes width {
    0% { width: 0; }
    50% { width: 50%; }
    100% { width: 100%; }
  }

  .app-loader-container {
    position: absolute;

    &.main {
      animation: width 2s infinite forwards cubic-bezier(0.785, 0.135, 0.15, 0.86);
      overflow: hidden;
    }
  }
}
</style>