import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useMenuItems = () => {
  const router = useRouter()

  const subPages = ref(null)

  const lastHover = ref(null)

  const onClickMenuItem = menuItem => {
    if (menuItem.path) router.push(menuItem.path)
  }

  const onMouseoverMenuItem = menuItem => {
    lastHover.value = menuItem
    if (menuItem.subPages) subPages.value = menuItem.subPages
  }

  const onMousemove = e => {
    if (!subPages.value) return

    const cl = e.target.classList
    if (
      (!cl.contains('ah-menu-item') && !cl.contains('sub-header-item')) ||
      !(lastHover.value || {}).subPages
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
      { path: '/indicators/marketcaps', title: 'MARKETCAPS' },
      { path: '/indicators/general', title: 'GENERAL' }
    ],
  }, {
    title: 'NEWS_AND_CONTENTS',
    pathPrefix: '/contents/',
    subPages: [
      { path: '/contents/news', title: 'NEWS' },
      { path: '/contents/twitter', title: 'TWITTER' },
      { path: '/contents/influencers', title: 'INFLUENCERS' },
      { path: '/contents/public-treasury', title: 'PUBLIC_TREASURY' },
      { path: '/contents/bitcoin-halving', title: 'BITCOIN_HALVING' }
    ],
  }, {
    title: 'APPS',
    pathPrefix: '/apps/',
    subPages: [
      { path: '/apps/portfolio', title: 'PORTFOLIO', },
      { path: '/apps/salary', title: 'SALARY' },
      { path: '/apps/games', title: 'GAMES' },
      { path: '/apps/voice-recorder', title: 'VOICE_RECORDER' }
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
    document.addEventListener('mousemove', onMousemove)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMousemove)
  })

  return {
    subPages,
    menuItems,
    onClickMenuItem,
    onMouseoverMenuItem,
  }
}

export default useMenuItems