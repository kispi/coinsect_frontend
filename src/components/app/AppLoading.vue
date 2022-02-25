<template>
  <div
    v-if="loading"
    @mousewheel.prevent
    @touchmove.prevent
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
  background: rgba(0, 0, 0, 0.5);
}
</style>