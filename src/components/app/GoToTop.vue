<template>
  <div
    v-if="!noShow"
    @click="$helpers.dom.scrollToTop"
    class="go-to-top"
    :class="{'no-show': $store.getters.scrollTop <= 120}">
    <i class="fal fa-arrow-up"/>
    {{ $router.currentRoute.value.routeGroup }}
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const noShow = computed(() => {
      const excludes = [
        '/about',
        '/apps/',
        '/indicators/',
      ]

      return excludes.some(path => router.currentRoute.value.path.includes(path))
    })

    return {
      noShow,
    }
  },
}
</script>

<style lang="scss" scoped>
.go-to-top {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: var(--white);
  border-radius: 50%;
  bottom: 16px;
  left: 16px;
  transition: all 0.5s ease;
  position: fixed;
  z-index: 1;
  cursor: pointer;

  &.no-show {
    opacity: 0;
    pointer-events: none;
  }

  i {
    font-size: 24px;
  }
}
</style>