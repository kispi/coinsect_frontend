import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const useMenuItems = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const router = useRouter()

  const store = useStore()

  const subPages = ref(null)

  const lastClick = ref(null)

  const onClickMenuItem = async (e, menuItem) => {
    lastClick.value = menuItem

    if (menuItem.path) {
      router.push(menuItem.path)
      return
    }

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
    subPages: [
      { path: '/indicators/real-time-positions', title: 'REAL_TIME_POSITIONS' },
      { path: '/indicators/leaderboard', title: 'LEADERBOARD' },
      { path: '/indicators/long-short', title: 'LONG_SHORT' },
      { path: '/indicators/general', title: 'GENERAL' },
    ],
  }, {
    title: 'MARKETS',
    pathPrefix: '/markets/',
    subPages: [
      { path: '/markets/crypto', title: 'CRYPTO' },
      { path: '/markets/nasdaq', title: 'NASDAQ' },
      { path: '/markets/assets-including-metal', title: 'ASSETS_INCLUDING_METAL' },
    ],
  }, {
    title: 'NEWS_AND_CONTENTS',
    pathPrefix: '/contents/',
    subPages: [
      { path: '/contents/news', title: 'NEWS' },
      // { path: '/contents/twitter', title: 'TWITTER' },
      { path: '/contents/influencers', title: 'INFLUENCERS' },
      { path: '/contents/public-treasury', title: 'PUBLIC_TREASURY' },
      { path: '/contents/bitcoin-halving', title: 'BITCOIN_HALVING' },
      // { path: '/contents/bitcoin-mining', title: 'BITCOIN_MINING' },
    ],
  }, {
    title: 'ONCHAIN',
    pathPrefix: '/onchain/',
    subPages: [
      { path: '/onchain/whale-alert', title: 'WHALE_ALERT' },
      { path: '/onchain/richlist', title: 'RICHLIST' },
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
      { path: '/apps/voice-recorder', title: 'VOICE_RECORDER' },
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