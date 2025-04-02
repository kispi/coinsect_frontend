<template>
  <div class="dashboards-main">
    <SectionNews/>
    <div
      v-if="dashboards"
      class="grid main">
      <template v-if="store.getters.boards">
        <MainSection
          :title="`${store.getters.boards[0].description} (비로그인 글쓰기 가능)`"
          :link="'/community'"
          :image="'https://cdn-icons-png.flaticon.com/512/1946/1946355.png'">
          <RecentPosts v-if="dashboardPosts[0]" :postItems="dashboardPosts[0].data" :board="store.getters.boards[0]"/>
        </MainSection>
        <MainSection
          :title="store.getters.boards[1].description"
          :link="'/community'"
          :image="'https://cdn-icons-png.flaticon.com/512/1946/1946355.png'">
          <RecentPosts v-if="dashboardPosts[1]" :postItems="dashboardPosts[1].data" :board="store.getters.boards[1]"/>
        </MainSection>
      </template>
      <MainSection
        :title="'KIMP'"
        :link="'/prices'"
        :image="require('@/assets/images/binance.svg')">
        <RealTimePriceCards
          ref="refRealTimePriceCards"
          :symbols="['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'TRX', 'ADA', 'BCH', 'DOT']"
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
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import MainSection from './MainSection'
import RecentPosts from '../RecentPosts'
import RealTimePriceCards from '@/components/views/real-time-prices/RealTimePriceCards'
import SectionNews from './SectionNews'
import communityService from '@/services/community'
import useRealTimePosition from '@/hooks/real-time-position'

const { helpers, store } = useGlobalHooks()

const { openWebsocket, sorter } = useRealTimePosition()

const refRealTimePriceCards = ref(null)

const interval = ref(null)

const dashboards = computed(() => store.getters.dashboardsMain)

const dashboardPosts = ref([])

const initDashboards = async () => {
  try {
    await store.dispatch('loadDashboardsMain')

    // 이하는 SSR에서는 실행하지 않음
    if (store.getters.isSSR) return

    dashboards.value.realTimePositions.data.sort(sorter)
    store.commit('setRealTimePositions', dashboards.value.realTimePositions)
    openWebsocket()
  } catch (e) {
    helpers.toast.error(e.data.message)
  }
}

const loadPostSimple = async boardId => {
  try {
    const resp = await communityService.post.all({
      where: `board_id=${boardId}`,
      limit: 10,
      sort: 'id',
      order: 'desc',
    })
    await helpers.post.populateRenderablePosts(resp.data)
    dashboardPosts.value[boardId - 1] = resp
  } catch (e) {
    return Promise.reject(e)
  }
}

const loadPosts = async () => {
  try {
    await Promise.all([loadPostSimple(1), loadPostSimple(2)])
  } catch (e) {
    return Promise.reject(e)
  }
}

onMounted(() => {
  initDashboards()
  loadPosts()
  helpers.bus.$on('write-post', loadPostSimple)

  interval.value = setInterval(() => {
    initDashboards()
    loadPosts()
  }, 1000 * 60 * 5)
})

onUnmounted(() => {
  helpers.bus.$off('write-post')
  if (interval.value) clearInterval(interval.value)
})
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