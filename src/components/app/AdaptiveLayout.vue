<template>
  <div
    class="adaptive-layout"
    :class="[`boundary-width-${boundaryWidth}`]"
    :style="{
      gap: `${gap}px`,
    }">
    <slot/>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  boundaryWidth?: number
  gap?: number
}>(), {
  boundaryWidth: 768, // 480, 768, 992, 1200 (0인 경우 항상 가로)
  gap: 0,
})
</script>

<style lang="scss">
@mixin createLayout($boundaryWidth) {
  &.#{'boundary-width-' + $boundaryWidth} {
    @media (min-width: #{$boundaryWidth + 'px'}) {
      flex-flow: row nowrap;

      > * {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }
}

.adaptive-layout {
  display: flex;
  flex-direction: column;

  @include createLayout(0);
  @include createLayout(480);
  @include createLayout(768);
  /* @include createLayout(992); */
  /* @include createLayout(1200); */
}
</style>