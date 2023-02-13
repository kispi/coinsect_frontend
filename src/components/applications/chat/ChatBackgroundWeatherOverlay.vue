<template>
  <div class="chat-background-weather-overlay">
    <div class="top">
      <div class="icons-area weather">
        <i
          @click="onClickWeather(weather)"
          class="fal clickable"
          :class="{
            'selected': weather.theme === selectedWeather.theme,
            [weather.icon]: true,
          }"
          :key="weather.theme"
          v-for="weather in weathers"
        />
      </div>
      <div class="icons-area vote">
        <div
          @click="updateSentiment('long')"
          class="long clickable">
          <i class="fal fa-arrow-trend-up"/>
          {{ $store.getters.chatStats.numBulls }}
        </div>
        <div
          @click="updateSentiment('short')"
          class="short clickable">
          <i class="fal fa-arrow-trend-down"/>
          {{ $store.getters.chatStats.numBears }}
        </div>
      </div>
    </div>
    <AppBackground
      v-if="selectedWeather.theme"
      class="overlay"
      :numFallingObjects="20"
      :theme="selectedWeather.theme"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import useChatHandler from '@/hooks/chat-handler'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const { updateSentiment } = useChatHandler()

    const selectedWeather = ref({})

    const weatherInterv = ref(null)

    const base = '서울'

    const weathers = [
      { theme: 'rain', icon: 'fa-umbrella' },
      { theme: 'snow', icon: 'fa-snowflake' },
    ]

    const onClickWeather = weather => selectedWeather.value = selectedWeather.value.theme === weather.theme ? {} : weather

    const loadWeather = async () => {
      if (store.getters.loading.weather) return

      try {
        store.commit('setLoading', { weather: true })
        const { data } = await plugins.$http.post('helpers/proxy', { url: 'https://www.weather.go.kr/w//renew2021/rest/main/current-weather-obs.do' })
        const targetWeather = ((data.find(o => o.stnKo === base) || {}).ww || '').toLowerCase()
        if (targetWeather.includes('rain')) selectedWeather.value = weathers[0]
        if (targetWeather.includes('snow')) selectedWeather.value = weathers[1]
      } finally {
        store.commit('setLoading', { weather: false })
      }
    }

    onMounted(() => {
      loadWeather()
      weatherInterv.value = setInterval(loadWeather, 1000 * 60 * 60) // 날씨는 1시간에 한번만 땡겨와도 족함
    })

    onUnmounted(() => {
      clearInterval(weatherInterv.value)
    })

    return {
      selectedWeather,
      weathers,
      updateSentiment,
      onClickWeather,
    }
  },
}
</script>

<style lang="scss" scoped>
.chat-background-weather-overlay {
  position: absolute;
  top: 44px;
  right: 0;
  bottom: 74px;
  left: 0;
  pointer-events: none;

  .top {
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: linear-gradient(to top, rgba(0, 0, 0, 0), var(--app-chat-background));
    font-size: 12px;
    user-select: none;
  }

  .icons-area {
    display: flex;
    padding: 12px;
    gap: 8px;

    &.weather {
      color: var(--text-stress);
    }

    .clickable {
      pointer-events: auto;
      cursor: pointer;

      /* &:hover,
      &.selected {
        opacity: 0.5;
      } */
    }
  }

  .long {
    color: var(--price-up-bybit);
  }

  .short {
    color: var(--price-down-bybit);
  }

  .app-background {
    opacity: 0.5;
  }
}
</style>
