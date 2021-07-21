<template>
  <img
    class="app-img"
    :class="fit"
    :src="src"
    :alt="alt"
    @load="e => $emit('load', e)"
    @error="e => e.target.src = fallbackImage"
  >
</template>

<script>
/**
 * background-image + background-size: cover 조합 대신 img 태그를 이용해 cover를 처리하는 컴포넌트.
 * 
 * 사용법:)
 * <AppImg :src="소스"/>
 */
import fallbackImage from '@/assets/images/no-image.png'

export default {
  props: {
    src: {
      type: String,
    },
    fit: {
      type: String,
      default: 'cover',
    },
    alt: {
      type: String,
    },
  },
  setup() {
    return {
      fallbackImage,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-img {
  width: 100%;
  height: 100%;

  &.cover {
    object-fit: cover;
  }

  &.contain {
    object-fit: contain;
  }
}
</style>