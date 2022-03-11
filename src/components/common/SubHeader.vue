<template>
  <nav class="sub-header">
    <div
      @click="$router.push(indicator.path)"
      class="sub-header-item"
      :class="{'selected': $router.currentRoute.value.path.includes(indicator.path)}"
      :key="indicator.path"
      v-for="indicator in items">
      {{ $translate(indicator.title) }}
    </div>
  </nav>
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
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &.selected {
      color: var(--text-stress);
      border-bottom: 2px solid var(--brand-primary);
    }

    &:hover {
      color: var(--brand-primary-hover);
    }
  }
}
</style>