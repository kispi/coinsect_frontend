<template>
  <div
    ref="refAppHeader"
    class="app-header">
    <div class="app-header-width-limiter">
      헤더 테스트
    </div>
  </div>
</template>

<script>
export default {
  setup() {
  },
}
</script>

<style lang="scss">
// Don't scope
.app-header {
  box-shadow: 0 -1px var(--gray-border) inset;
  transition: all 0.2s ease;

  .app-header-width-limiter {
    height: var(--app-header-height);
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 1440px;
    margin: auto;
  }
}
</style>