<template>
  <nav
    v-if="modelValue"
    class="sub-header">
    <RouterLink
      draggable="false"
      @click="$emit('update:modelValue', null)"
      :to="item.path"
      class="sub-header-item"
      :class="{'selected': $router.currentRoute.value.path.includes(item.path)}"
      :key="item.path"
      v-for="item in modelValue">
      {{ $translate(item.title) }}
    </RouterLink>
  </nav>
</template>

<script>
export default {
  props: {
    modelValue: Array,
  },
}
</script>

<style lang="scss" scoped>
.sub-header {
  position: absolute;
  background: var(--background-base);
  top: calc(var(--app-header-height) - 4px);
  width: 320px;
  border: 1px solid var(--border-base);
  border-radius: 0 0 4px 4px;
  z-index: 5;

  .sub-header-item {
    padding: 8px;
    display: block;
    white-space: nowrap;
    transition: none;
    cursor: pointer;

    &.selected {
      color: var(--brand-primary);
    }

    &:hover {
      color: var(--brand-primary-hover);
    }
  }

  @media (max-width: 767px) {
    padding: 0 var(--app-default-page-padding);
    width: calc(100% + 2px);
    left: -1px;
    right: -1px;
  }
}
</style>