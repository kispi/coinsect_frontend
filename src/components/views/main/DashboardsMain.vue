<template>
  <div class="dashboards-main">
    <SectionNews/>
    <div
      v-if="dashboards"
      class="grid main">
      <MainSection
        :title="'COMMUNITY'"
        :link="'/community'"
        :image="'https://cdn-icons-png.flaticon.com/512/1946/1946355.png'">
        <RecentPosts v-if="$store.getters.boards" :posts="dashboards.recentPosts"/>
      </MainSection>
      <MainSection
        :title="'KIMP'"
        :link="'/prices'"
        :image="require('@/assets/images/binance.svg')">
        <RealTimePriceCards
          ref="refRealTimePriceCards"
          :symbols="['BTC', 'ETH', 'XRP', 'ADA', 'DOGE', 'SOL', 'LTC', 'TRX', 'BCH']"
        />
      </MainSection>
      <MainSection
        :title="'REAL_TIME_POSITIONS'"
        :link="'/indicators/positions'"
        :image="'https://d1085v6s0hknp1.cloudfront.net/assets/icon-jg.jpg'"
        :tooltip="'TOOLTIP_REAL_TIME_POSITIONS'">
        <div class="flex g-4">
          <CPosition
            :position="position"
            :key="position.name"
            v-for="position in dashboards.realTimePositions.data"
          />
        </div>
      </MainSection>
      <MainSection
        :title="'PRICE_PREDICTIONS'"
        :image="'https://cdn-icons-png.flaticon.com/512/4882/4882559.png'"
        :tooltip="'TOOLTIP_PRICE_PREDICTIONS'">
        <PricePredictions/>
      </MainSection>
      <MainSection
        :title="titleBitmexLeaderboard"
        :link="'/indicators/leaderboard'"
        :image="'https://d1085v6s0hknp1.cloudfront.net/images/exchanges/BITMEX.png'">
        <BitmexSimple :leaderboards="dashboards.leaderboards"/>
      </MainSection>
      <MainSection
        :title="'WHALE_ALERT'"
        :link="'/indicators/whale-alert'"
        :image="'https://d1085v6s0hknp1.cloudfront.net/assets/icon-whalealert.jpg'">
        <div class="flex g-4">
          <WhaleAlertItem
            :whaleAlert="whaleAlert"
            :key="whaleAlert.hash"
            v-for="whaleAlert in dashboards.whaleAlerts.data"
          />
        </div>
      </MainSection>
      <MainSection
        :title="'광고'"
        :image="'https://d1085v6s0hknp1.cloudfront.net/assets/logo.png'">
        <AdSense :dataAdSlot="'8789268236'" style="min-height: 280px;" :responsive="true" class="m-t-8"/>
      </MainSection>
    </div>
    <div
      v-else
      class="grid main">
      <AppSkeleton style="height: 360px;"/>
      <AppSkeleton style="height: 360px;"/>
      <AppSkeleton style="height: 360px;"/>
      <AppSkeleton style="height: 360px;"/>
      <AppSkeleton style="height: 360px;"/>
      <AppSkeleton style="height: 360px;"/>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import BitmexSimple from './BitmexSimple'
import MainSection from './MainSection'
import PricePredictions from './PricePredictions'
import RecentPosts from '../RecentPosts'
import RealTimePriceCards from '@/components/views/real-time-prices/RealTimePriceCards'
import SectionNews from './SectionNews'
import useRealTimePosition from '@/hooks/real-time-position'

export default {
  components: { BitmexSimple, MainSection, PricePredictions, RecentPosts, RealTimePriceCards, SectionNews },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const { connection, openWebsocket, sorter } = useRealTimePosition()

    const refRealTimePriceCards = ref(null)

    const timeout = ref(null)

    const dashboards = computed(() => store.getters.dashboardsMain)

    const titleBitmexLeaderboard = computed(() => {
      const items = (dashboards.value || {}).leaderboards
      if (!items) return ''

      const positions = { long: 0, short: 0 }
      items.forEach(o => {
        if (o.side === 'Long') positions.long += 1
        if (o.side === 'Short') positions.short += 1
      })
      return `
        ${plugins.$translate('BITMEX_LEADERBOARD')}
        (<span class="c-price-up-bybit"><i class="fal fa-arrow-trend-up m-r-4"></i>${positions.long}</span>
        <span class="c-price-down-bybit"><i class="fal fa-arrow-trend-down m-r-4"></i>${positions.short}</span>)
      `
    })

    const initDashboards = async () => {
      try {
        await store.dispatch('loadDashboardsMain')

        // 이하는 SSR에서는 실행하지 않음
        if (store.getters.isSSR) return

        dashboards.value.realTimePositions.data.sort(sorter)
        store.commit('setRealTimePositions', dashboards.value.realTimePositions)
        openWebsocket()

        timeout.value = setTimeout(initDashboards, 1000 * 60 * 5)
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    onMounted(initDashboards)

    onUnmounted(() => {
      if (timeout.value) clearTimeout(timeout.value)
    })

    return {
      refRealTimePriceCards,
      connectionRealTimePositions: connection,
      dashboards,
      titleBitmexLeaderboard,
    }
  },
}
</script>

<style lang="scss">
.dashboards-main {
  overflow: hidden;

  .grid {
    display: grid;
    gap: 16px;

    &.main {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

  @media (min-width: 768px) {
    .grid.main {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1200px) {
    .grid.main {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>