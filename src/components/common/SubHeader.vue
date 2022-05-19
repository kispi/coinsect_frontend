<template>
  <nav class="sub-header">
    <RouterLink
      draggable="false"
      :to="item.path"
      class="sub-header-item"
      :class="{'selected': $router.currentRoute.value.path.includes(item.path)}"
      :key="item.path"
      v-for="item in items">
      {{ $translate(item.title) }}
    </RouterLink>
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
  overflow-x: auto;

  .sub-header-item {
    padding: 8px;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: none;
    cursor: pointer;

    &.selected {
      border-bottom: 2px solid var(--brand-primary);
      color: var(--brand-primary);
    }

    &:hover {
      color: var(--brand-primary-hover);
    }
  }
}
</style>