<template>
  <div class="view-real-time-positions">
    <div class="title">{{ currentTime.format('YYYY-MM-DD HH:mm:ss') }}</div>
    <div class="grid">
      <div
        class="position-box"
        :class="{
          'short': position.size < 0,
          'long': position.size > 0,
        }"
        :key="position.name"
        v-for="position in $store.getters.realTimePositions">
        <div v-if="position.image" class="image-container">
          <AppImg :src="position.image" v-if="position.image" class="overlay"/>
        </div>
        <div class="info">
          <div class="summary" v-html="position.$$summary"/>
          <div class="name" v-html="position.name"/>
          <div class="entry" v-if="position.entry">진입: ${{ position.entry.toLocaleString() }}</div>
          <div class="contract" v-if="position.contract">계약: {{ position.contract.toLocaleString() }}</div>
          <div class="size" v-if="position.size">규모: {{ position.size.toLocaleString() }}</div>
        </div>
      </div>
    </div>
    <div class="description">
      * 박호두 등 BJ들의 포지션의 경우 운영자가 방송을 모니터링하며 입력하므로 대부분 실시간이며, 유튜버들의 경우 최신 영상으로 수집된 포지션이 영상 업로드 이후에 종료되었을 수 있기에 실시간이 아닐 수 있습니다. 어떤 경우이든 재미로만 보시고, 호반꿀이든 호반반꿀이든 <b class="c-danger">절대로 타인의 매매를 참고하여 매매하지 마십시오</b>.
    </div>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const timeInterv = ref(null)

    const apiInterv = ref(null)

    const currentTime = ref(plugins.$helpers.dayjs())

    const callApi = async () => {
      try {
        await store.dispatch('loadRealTimePositions')
      } catch (e) {}
    }

    onMounted(() => {
      callApi()

      if (store.getters.isSSR) return

      timeInterv.value = setInterval(() => currentTime.value = plugins.$helpers.dayjs(), 1000)

      apiInterv.value = setInterval(callApi, 1000 * 60)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(timeInterv.value)
      clearInterval(apiInterv.value)
    })

    return {
      currentTime,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-real-time-positions {
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 16px;
  }

  .position-box {
    background: var(--background-light);
    color: var(--text-stress);
    border-radius: 8px;
    border: 1px solid var(--border-base);
    line-height: 18px;
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 120px;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }

    .image-container {
      position: relative;
      height: 100%;

      .app-img {
        object-position: top;
      }
    }

    .info {
      padding: 0 12px;

      .summary {
        margin-bottom: 8px;
        font-size: 15px;
        font-weight: 700;
      }
    }

    &.short {
      background: var(--price-down-bg);

      .summary {
        color: var(--price-down);
      }
    }

    &.long {
      background: var(--price-up-bg);

      .summary {
        color: var(--price-up);
      }
    }
  }

  .title {
    margin-bottom: 16px;
    color: var(--text-stress);
    font-family: Arial, Helvetica, sans-serif;
  }

  .description {
    font-size: 12px;
    line-height: 20px;
    margin-top: 16px;
  }

  @media (max-width: 767px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 479px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>