<template>
  <div
    v-if="weather"
    class="chat-background-weather-overlay">
    <AppBackground
      class="overlay"
      :numFallingObjects="weather.numFallingObjects"
      :theme="weather.theme"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const weather = ref(null)

    const weatherInterv = ref(null)

    const base = '서울'

    const loadWeather = async () => {
      if (store.getters.loading.weather) return

      try {
        store.commit('setLoading', { weather: true })
        const { data } = await plugins.$http.post('helpers/proxy', { url: 'https://www.weather.go.kr/w//renew2021/rest/main/current-weather-obs.do' })
        const targetWeather = ((data.find(o => o.stnKo === base) || {}).ww || '').toLowerCase()
        if (targetWeather.includes('rain')) weather.value = { theme: 'rain', numFallingObjects: 100 }
        if (targetWeather.includes('snow')) weather.value = { theme: 'snow', numFallingObjects: 20 }
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
      weather,
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
  opacity: 0.5;
}
</style>