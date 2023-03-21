import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const useMenuItems = () => {
  const { plugins, store, router } = useGlobalHooks()

  const subPages = ref(null)

  const lastClick = ref(null)

  const onClickMenuItem = async (e, menuItem) => {
    lastClick.value = menuItem

    if (menuItem.subPages) {
      subPages.value = null
      await plugins.$helpers.sleep(0)
      subPages.value = menuItem.subPages
      await plugins.$helpers.sleep(0)
      const dom = document.getElementsByClassName('sub-header')[0]
      if (!dom) return

      const rectClickedAnchorTag = e.target.getBoundingClientRect()
      const rectDom = dom.getBoundingClientRect()

      if (window.innerWidth >= rectClickedAnchorTag.left + rectDom.width) {
        dom.style.left = `${rectClickedAnchorTag.left}px`
      } else {
        dom.style.right = `${(window.innerWidth - rectClickedAnchorTag.right)}px`
      }
      return
    }

    if (menuItem.path) {
      router.push(menuItem.path)
      return
    }
  }

  const onClickDocument = e => {
    if (!subPages.value) return

    const cl = e.target.classList
    if (
      (!cl.contains('ah-menu-item') && !cl.contains('sub-header-item') && !cl.contains('fa-chevron-down')) ||
      !(lastClick.value || {}).subPages
    ) subPages.value = null
  }

  const menuItems = computed(() => [{
    title: 'KIMP',
    path: '/',
  }, {
    title: 'INDICATORS',
    pathPrefix: '/indicators/',
    path: '/indicators/real-time-positions',
    subPages: [
      { path: '/indicators/real-time-positions', title: 'REAL_TIME_POSITIONS' },
      { path: '/indicators/leaderboard', title: 'LEADERBOARD' },
      { path: '/indicators/whale-alert', title: 'WHALE_ALERT' },
      { path: '/indicators/richlist', title: 'RICHLIST' },
    ],
  }, {
    title: 'COMMUNITY',
    pathPrefix: '/community',
    path: '/community',
  }, {
    title: 'NEWS_AND_CONTENTS',
    pathPrefix: '/contents/',
    path: '/contents/news',
    subPages: [
      { path: '/contents/news', title: 'NEWS' },
      { path: '/contents/economic-calendar', title: 'ECONOMIC_CALENDAR' },
      { path: '/contents/public-treasury', title: 'PUBLIC_TREASURY' },
      { path: '/contents/influencers', title: 'INFLUENCERS' },
      { path: '/contents/crypto-referral', title: 'CRYPTO_REFERRAL' },
    ],
  }, {
    title: 'MARKETS',
    pathPrefix: '/markets/',
    path: '/markets/crypto',
    subPages: [
      { path: '/markets/crypto', title: 'CRYPTO' },
      { path: '/markets/nasdaq', title: 'NASDAQ' },
      { path: '/markets/kospi', title: 'KOSPI' },
      { path: '/markets/assets-including-metal', title: 'ASSETS_INCLUDING_METAL' },
    ],
  }, {
    title: 'APPS',
    pathPrefix: '/apps/',
    path: '/apps/portfolio',
    subPages: [
      { path: '/apps/portfolio', title: 'PORTFOLIO', },
      { path: '/apps/salary', title: 'SALARY' },
      { path: '/apps/lottery', title: 'LOTTERY' },
      { path: '/apps/seo', title: 'SEO' },
      { path: '/apps/games', title: 'GAMES' },
      { path: '/apps/image-resizer', title: 'IMAGE_RESIZER' },
      { path: '/apps/image-moderation', title: 'IMAGE_MODERATION' },
      { path: '/apps/voice-recorder', title: 'VOICE_RECORDER' },
    ],
  }, {
    title: 'ABOUT',
    path: '/about',
  }].map(o => {
    const p = router.currentRoute.value.path

    return {
      ...o,
      $$selected: p.startsWith(o.pathPrefix) || p === o.path,
    }
  }))

  watch(
    () => store.getters.windowInnerWidth,
    () => subPages.value = null,
  )

  onMounted(() => {
    document.addEventListener('click', onClickDocument)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onClickDocument)
  })

  return {
    subPages,
    menuItems,
    onClickMenuItem,
  }
}

export default useMenuItems