import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const useMenuItems = () => {
  const { router } = useGlobalHooks()

  const menuItems = computed(() => [{
    title: 'HOME',
    path: '/',
  }, {
    title: 'KIMP',
    path: '/prices',
  }, {
    title: 'INDICATORS',
    pathPrefix: '/indicators/',
    subPages: [
      { path: '/indicators/real-time-positions', title: 'REAL_TIME_POSITIONS' },
      { path: '/indicators/leaderboard', title: 'BITMEX_LEADERBOARD' },
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
    subPages: [
      { path: '/markets/crypto', title: 'CRYPTO' },
      { path: '/markets/nasdaq', title: 'NASDAQ' },
      { path: '/markets/kospi', title: 'KOSPI' },
      { path: '/markets/assets-including-metal', title: 'ASSETS_INCLUDING_METAL' },
    ],
  }, {
    title: 'APPS',
    pathPrefix: '/apps/',
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
    if (o.subPages) {
      o.subPages = o.subPages.map(o => ({
        ...o,
        $$selected: p === o.path,
      }))
    }

    return {
      ...o,
      $$selected: o.path === '/community' ? p.startsWith(o.pathPrefix) : p === o.path,
    }
  }))

  return {
    menuItems,
  }
}

export default useMenuItems