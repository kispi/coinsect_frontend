<template>
  <div class="app-loader" :style="style">
    <div class="app-loader-container">
      <img src="/favicon/logo.png" :style="style"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 64,
  },
})

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<style lang="scss" scoped>
.app-loader {
  position: relative;

  .app-loader-container {
    position: absolute;
  }
}
</style>