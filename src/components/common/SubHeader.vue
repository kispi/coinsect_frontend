<template>
  <transition name="fade">
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
  </transition>
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
  top: calc(var(--app-header-height));
  width: 240px;
  border-left: 1px double var(--border-base);
  border-bottom: 1px double var(--border-base);
  border-right: 1px double var(--border-base);
  border-radius: 0 0 8px 8px;
  box-shadow: 1px 2px 4px rgba(32, 64, 128, 0.5);
  z-index: 5;

  .sub-header-item {
    color: var(--text-stress);
    padding: 12px 16px;
    display: block;
    white-space: nowrap;
    transition: none;
    user-select: none;
    cursor: pointer;

    &.selected {
      color: var(--brand-primary);
    }

    &:hover {
      background: var(--brand-primary-hover-bg);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }
}
</style>
