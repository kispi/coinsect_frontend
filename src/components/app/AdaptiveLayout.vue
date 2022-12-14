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

<script>
/**
 * boundaryWidth를 기준으로, '이상'이 되면 flex-row로 (가로), '미만'은 block으로 (세로) 처리해주는 컴포넌트.
 */
export default {
  props: {
    boundaryWidth: {
      type: Number,
      default: 768, // 480, 768, 992, 1200 (0인 경우 항상 가로)
    },
    gap: {
      type: Number,
      default: 0, // 0, 4, 8, ... , 80
    },
  },
}
</script>

<style lang="scss">
@mixin createLayout($boundaryWidth) {
  &.#{'boundary-width-' + $boundaryWidth} {
    @media (min-width: #{$boundaryWidth + 'px'}) {
      display: flex;
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
  /* @include createLayout(480); */
  @include createLayout(768);
  /* @include createLayout(992); */
  /* @include createLayout(1200); */
}
</style>