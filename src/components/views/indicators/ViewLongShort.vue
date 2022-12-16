<template>
  <div class="view-long-short">
    <div class="params">
      <AppDropdown
        class="symbols"
        :align="'right'"
        :dropdownItems="symbols"
        @select-dropdown-item="o => params.symbol = o.key"
      />
      <AppDropdown
        class="time-types"
        :align="'right'"
        :dropdownItems="timeTypes"
        @select-dropdown-item="o => params.timeType = o.key"
      />
    </div>
    <div
      v-if="result"
      class="result">
      <div class="row c-text-stress f-700 m-b-24">
        <div class="info center">
          <div class="logo"><AppImg :src="result.symbolLogo"/></div>
          <div class="name">{{ result.symbol }} {{ $translate('STATISTICS') }}</div>
        </div>
        <LongShortRatio :long="result.longRate" :short="result.shortRate"/>
      </div>
      <div
        class="row"
        :key="ex.exchangeName"
        v-for="(ex, idx) in result.list">
        <div class="info">
          <div class="rank f-mono">{{ idx + 1 }}</div>
          <div class="logo"><AppImg :src="ex.exchangeLogo"/></div>
          <div class="name">{{ ex.exchangeName }}</div>
        </div>
        <LongShortRatio :long="ex.longRate" :short="ex.shortRate"/>
      </div>
    </div>
    <PoweredBy :by="'coinglass'" :link="'https://www.coinglass.com/ko/LongShortRatio'" class="m-t-24"/>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import marketInfoService from '@/services/market-info'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const params = ref({
      timeType: 3,
      symbol: 'BTC',
    })

    const timeTypes = computed(() => [
      { name: '5분', key: 3 },
      { name: '15분', key: 10 },
      { name: '30분', key: 11 },
      { name: '1시간', key: 2 },
      { name: '4시간', key: 1 },
      { name: '12시간', key: 4 },
      { name: '1일', key: 5 },
    ].map(o => ({
      ...o,
      $$selected: o.key === params.value.timeType,
    })))

    const symbols = computed(() => [
      'BTC', 'ETH', 'XRP', 'ADA', 'LTC', 'TRX', 'ETC', 'LINK', 'BCH', 'EOS', 'UNI', 'SOL', 'BNB', 'DOT', 'USDT',
    ].map(key => ({
      key,
      name: key,
      $$selected: key === params.value.symbol,
    })))

    const result = ref(null)

    const interv = ref(null)

    const callApi = async () => {
      try {
        const { data } = await marketInfoService.longShort(params.value)
        result.value = data[0]
      } catch (e) {}
    }

    onMounted(() => {
      callApi()

      if (store.getters.isSSR) return

      interv.value = setInterval(callApi, 5000)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    watch(
      () => params.value,
      callApi,
      { deep: true },
    )

    return {
      params,
      timeTypes,
      symbols,
      result,
    }
  },
}
</script>

<style lang="scss">
.view-long-short {
  .params {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;

    .app-dropdown {
      width: 80px;

      &:not(:last-child) {
        margin-right: 8px;
      }

      .list-container {
        width: 80px;
      }
    }
  }

  .row {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    .info {
      display: flex;
      align-items: center;
      width: 136px;
    }

    .rank {
      width: 24px;
      font-size: 12px;
      text-align: right;
      margin-right: 8px;
    }

    .logo {
      width: 24px;
      height: 24px;
    }

    .name {
      margin-left: 8px;
    }

    .long-short-ratio {
      flex: 1;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid var(--border-base);
    }
  }

  @media (max-width: 479px) {
    .long-short-ratio {
      .ratio-chunk {
        font-size: 12px;
      }
    }
  }
}
</style>