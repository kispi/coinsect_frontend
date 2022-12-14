<template>
  <div class="app-loader" :style="style">
    <div class="app-loader-container">
      <img src="/favicon/logo.png" :style="style"/>
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

  .app-loader-container {
    position: absolute;
  }
}
</style>