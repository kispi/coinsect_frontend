<template>
  <div class="view-main">
    <div
      v-if="dashboards"
      class="grid main">
      <MainSection :title="'COMMUNITY'" :link="'/community'">
        <RecentPosts :posts="dashboards.posts"/>
      </MainSection>
      <MainSection
        :title="'REAL_TIME_POSITIONS'"
        :link="'/indicators/real-time-positions'"
        :tooltip="'TOOLTIP_REAL_TIME_POSITIONS'">
        <div class="grid">
          <CPosition
            :position="position"
            :key="position.name"
            v-for="position in dashboards.realTimePositions.data.filter(p => p.editable)"
          />
        </div>
      </MainSection>
      <MainSection :title="'WHALE_ALERT'" :link="'/indicators/whale-alert'">
        <div class="grid">
          <WhaleAlertItem
            :whaleAlert="whaleAlert"
            :key="whaleAlert"
            v-for="whaleAlert in dashboards.whaleAlerts.data"
          />
        </div>
      </MainSection>
      <MainSection :title="titleBitmexLeaderboard" :link="'/indicators/leaderboard'">
        <div class="grid bitmex-positions">
          <div
            class="bitmex-position"
            :class="(position.side || '').toLowerCase()"
            :key="position.name"
            v-for="position in dashboards.leaderboards">
            <i class="fal" :class="{'fa-arrow-trend-up': position.side === 'Long', 'fa-arrow-trend-down': position.side === 'Short'}"/>
            {{ position.name }}
          </div>
        </div>
      </MainSection>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import MainSection from './MainSection'
import RecentPosts from '../RecentPosts'
import useRealTimePosition from '@/hooks/real-time-position'

export default {
  components: { MainSection, RecentPosts },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const { openWebsocket } = useRealTimePosition()

    const dashboards = ref(null)

    const timeout = ref(null)

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
        (<span class="c-price-up"><i class="fal fa-arrow-trend-up m-r-4"></i>${positions.long}</span>
        <span class="c-price-down"><i class="fal fa-arrow-trend-down m-r-4"></i>${positions.short}</span>)
      `
    })

    const initDashboards = async () => {
      try {
        dashboards.value = await plugins.$http.get('dashboards/main')

        // 리더보드에서 '워뇨띠' 찾아넣기
        const found = (dashboards.value.leaderboards || []).find(o => o.name === 'aoa')
        if (found) found.name = 'aoa (워뇨띠)'

        // 최근 게시글에서 이미지 추출해서 넣기
        dashboards.value.posts.data.forEach(async post => {
          post.$$images = plugins.$helpers.retrieveImagesFromHTML(post.content)
          post.board.$$color = `#${(await plugins.$helpers.crypto.hash.sha256(post.board.description) || '').substring(0, 6)}`
        })

        // 이하는 SSR에서는 실행하지 않음
        if (store.getters.isSSR) return

        store.commit('setRealTimePositions', dashboards.value.realTimePositions)
        openWebsocket()
        setTimeout(initDashboards, 1000 * 60)
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const init = async () => {
      await initDashboards()
    }

    onMounted(init)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearTimeout(timeout.value)
    })

    return {
      dashboards,
      titleBitmexLeaderboard,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-main {
  .grid {
    display: grid;
    gap: 8px;

    &.main {
      gap: 24px;
    }
  }

  .bitmex-positions {
    grid-template-columns: repeat(2, 1fr);

    .bitmex-position {
      border: 1px solid var(--border-base);
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;

      i {
        width: 16px;
      }

      &.long {
        color: var(--price-up);
        background: var(--price-up-bg);
      }

      &.short {
        color: var(--price-down);
        background: var(--price-down-bg);
      }
    }
  }

  @media (min-width: 768px) {
    .grid.main {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>