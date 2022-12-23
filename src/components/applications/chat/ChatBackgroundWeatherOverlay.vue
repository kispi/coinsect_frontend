<template>
  <div class="chat-background-weather-overlay">
    <AppImg
      v-if="chatBg"
      :src="chatBg"
      class="bg-url overlay"
    />
    <div class="bg-functions">
      <i
        @click="onClickBgImage"
        class="fal fa-image"
        :class="{'selected': chatBg}"
      />
      <i
        @click="onClickWeather(weather)"
        class="fal"
        :class="{
          'selected': weather.theme === selectedWeather.theme,
          [weather.icon]: true,
        }"
        :key="weather.theme"
        v-for="weather in weathers"
      />
    </div>
    <AppBackground
      v-if="selectedWeather.theme"
      class="overlay"
      :numFallingObjects="selectedWeather.numFallingObjects"
      :theme="selectedWeather.theme"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const chatBg = computed(() => store.getters.settings.chatBg)

    const selectedWeather = ref({})

    const weatherInterv = ref(null)

    const base = '서울'

    const weathers = [
      { theme: 'rain', numFallingObjects: 100, icon: 'fa-umbrella' },
      { theme: 'snow', numFallingObjects: 20, icon: 'fa-snowflake' },
    ]

    const onClickWeather = weather => selectedWeather.value = selectedWeather.value.theme === weather.theme ? {} : weather

    const onClickBgImage = () => {
      if (chatBg.value) {
        plugins.$modal.confirm({ body: '채팅방 배경 이미지를 제거할까요?' })
          .then(idx => {
            if (!idx) return

            store.commit('setSettings', { chatBg: null })
          })
        return
      }

      plugins.$modal.input({
        title: '배경 이미지로 사용할 URL을 입력하세요',
        inputValue: store.getters.settings.chatBg,
        placeholder: 'https://',
      }).then(url => {
        store.commit('setSettings', { chatBg: url })
      })
    }

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

    const recommendChatBg = () => {
      const arr = (store.getters.config || {}).chatBgImages || []
      if (!arr.find(bgUrl => bgUrl == chatBg.value)) return // 사용자가 정한 url이 코인충에 없는 이미지인 경우

      store.commit('setSettings', { chatBg: arr[Math.floor(Math.random() * arr.length)] })
    }

    onMounted(() => {
      loadWeather()
      recommendChatBg()
      weatherInterv.value = setInterval(loadWeather, 1000 * 60 * 60) // 날씨는 1시간에 한번만 땡겨와도 족함
    })

    onUnmounted(() => {
      clearInterval(weatherInterv.value)
    })

    return {
      chatBg,
      selectedWeather,
      weathers,
      onClickWeather,
      onClickBgImage,
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

  .bg-functions {
    position: absolute;
    top: 0;
    z-index: 1;
    display: flex;
    padding: 12px;
    gap: 8px;
    pointer-events: auto;

    i {
      color: var(--text-stress);
      cursor: pointer;

      &:hover,
      &.selected {
        color: var(--brand-primary);
      }
    }
  }

  .app-background {
    opacity: 0.5;
  }

  .bg-url {
    z-index: -1;
    opacity: 0.25;
  }
}
</style>