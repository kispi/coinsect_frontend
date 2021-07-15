<template>
  <div
    v-if="loading"
    class="app-loading">
    <AppLoader/>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean
    },
  },
}
</script>

<style lang="scss" scoped>
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.5);
}
</style>