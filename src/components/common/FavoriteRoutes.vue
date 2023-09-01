<template>
  <div class="favorite-routes m-b-16">
    <RouterLink
      class="btn-light"
      :class="{'selected': route.path === $router.currentRoute.value.path}"
      :to="route.path"
      :key="route.path"
      v-for="route in favoriteRoutes">
      <AppImg v-if="route.img" :src="route.img" :fit="'contain'"/>
      <span v-if="route.emoji" class="emoji">{{ route.emoji }}</span>
      <span class="route-title">{{ $translate(route.title) }}</span>
    </RouterLink>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const favoriteRoutes = computed(() => {
      const base = [
        { title: 'NEWS', path: '/contents/news', emoji: '📰' },
        { title: 'ECONOMIC_CALENDAR', path: '/contents/economic-calendar', img: 'https://d1085v6s0hknp1.cloudfront.net/assets/icon-investing.jpg' },
        { title: 'CRYPTO', path: '/markets/crypto', emoji: '₿' },
        { title: 'NASDAQ', path: '/markets/nasdaq', img: 'https://yt3.googleusercontent.com/ytc/AGIKgqMZKdfkx5yIMjtGEuX6jPQA_NIqwwbpfq1MdhRDNw=s900-c-k-c0x00ffffff-no-rj' },
      ]
      if (!store.getters.isMobile) base.push({ title: 'KOSPI', path: '/markets/kospi', img: 'https://www.samsung.com/sec/static/etc/designs/smg/global/imgs/logo-square-letter.png' })

      return base
    })

    return {
      favoriteRoutes,
    }
  },
}
</script>

<style lang="scss">
.favorite-routes {
  display: flex;
  gap: 8px;
  justify-content: space-between;

  a {
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    flex: 1;
    background: var(--background-light);
    border-radius: 8px;

    &.selected {
      color: var(--text-stress);
      box-shadow: 0 0 0 1px var(--border-light);
      font-weight: 700;
    }

    &:not(.selected) {
      .route-title {
        opacity: 0.9;
      }
    }

    .emoji,
    .app-img {
      width: 24px;
      margin-right: 8px;
      border-radius: 50%;
      text-align: center;
    }
  }

  @media (max-width: 479px) {
    a {
      font-size: 12px;

      .emoji,
      .app-img {
        width: 16px;
        margin-right: 4px;
      }
    }
  }
}
</style>
