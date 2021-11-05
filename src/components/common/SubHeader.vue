<template>
  <div class="sub-header">
    <div
      @click="$router.push(indicator.path)"
      class="sub-header-item"
      :class="{'selected': $router.currentRoute.value.path.includes(indicator.path)}"
      :key="indicator.path"
      v-for="indicator in items">
      {{ $translate(indicator.title) }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
  },
}
</script>

<style lang="scss" scoped>
.sub-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .sub-header-item {
    padding: 8px;
    cursor: pointer;
    border-bottom: 2px solid transparent;

    &.selected {
      color: var(--text-stress);
      font-weight: 700;
      border-bottom: 2px solid var(--brand-primary);
    }
  }
}
</style>