import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useMenuItems = () => {
  const router = useRouter()

  const subPages = ref(null)

  const lastClick = ref(null)

  const onClickMenuItem = menuItem => {
    lastClick.value = menuItem

    if (menuItem.path) {
      router.push(menuItem.path)
      return
    }

    if (menuItem.subPages) subPages.value = menuItem.subPages
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
    subPages: [
      { path: '/indicators/real-time-positions', title: 'REAL_TIME_POSITIONS' },
      { path: '/indicators/leaderboard', title: 'LEADERBOARD' },
      { path: '/indicators/long-short', title: 'LONG_SHORT' },
      { path: '/indicators/general', title: 'GENERAL' }
    ],
  }, {
    title: 'MARKETS',
    pathPrefix: '/markets/',
    subPages: [
      { path: '/markets/crypto', title: 'CRYPTO' },
      { path: '/markets/nasdaq', title: 'NASDAQ' },
    ],
  }, {
    title: 'NEWS_AND_CONTENTS',
    pathPrefix: '/contents/',
    subPages: [
      { path: '/contents/news', title: 'NEWS' },
      // { path: '/contents/twitter', title: 'TWITTER' },
      { path: '/contents/influencers', title: 'INFLUENCERS' },
      { path: '/contents/public-treasury', title: 'PUBLIC_TREASURY' },
      { path: '/contents/bitcoin-halving', title: 'BITCOIN_HALVING' }
    ],
  }, {
    title: 'ONCHAIN',
    pathPrefix: '/onchain/',
    subPages: [
      { path: '/onchain/richlist', title: 'RICHLIST' },
    ],
  }, {
    title: 'APPS',
    pathPrefix: '/apps/',
    subPages: [
      { path: '/apps/portfolio', title: 'PORTFOLIO', },
      { path: '/apps/salary', title: 'SALARY' },
      // { path: '/apps/games', title: 'GAMES' },
      // { path: '/apps/voice-recorder', title: 'VOICE_RECORDER' }
    ],
  }, {
    title: 'COMMUNITY',
    path: '/community',
  }, {
    title: 'ABOUT',
    path: '/about',
  }].map(o => {
    const p = router.currentRoute.value.path

    return {
      ...o,
      $$selected: (() => {
        if (o.subPages) return p.startsWith(o.pathPrefix)

        else return p === o.path
      })()
    }
  }))

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