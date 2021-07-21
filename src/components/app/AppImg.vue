<template>
  <img
    class="app-img"
    :class="fit"
    :src="imageSource"
    :alt="alt"
    @load="e => $emit('load', e)"
    @error="error = true"
  >
</template>

<script>
/**
 * background-image + background-size: cover 조합 대신 img 태그를 이용해 cover를 처리하는 컴포넌트.
 * 
 * 사용법:)
 * <AppImg :src="소스"/>
 */
import { ref, computed } from 'vue'

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
      default: '코인충 - 대한민국 No.1 암호자산 커뮤니티',
    },
  },
  setup(props) {
    const error = ref(props.src ? null : true)

    const fallbackImage = ''

    const imageSource = computed(() => error.value ? fallbackImage : props.src)

    return {
      imageSource,
      error,
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