<template>
  <div class="price-predictions">
    <div
      v-if="((resp || {}).data || []).length === 0"
      class="center f-500 f-16 c-text-stress">
      {{ $translate('NO_SEARCH_RESULT') }}
    </div>
    <template v-else>
      <PricePrediction
        :pricePrediction="prediction"
        :key="prediction.sharingKey"
        v-for="prediction in (resp || {}).data"
      />
    </template>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const resp = ref(null)

    const createPrediction = async () => {
      try {
        await communityService.pricePrediction.create({
          nickname: store.getters.me ? store.getters.me.profile.nickname : ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname,
          password: '1234',
          ticker: 'BTCUSDT',
          timeFrom: '2025-01-01',
          timeTo: '2025-02-28',
          priceMin: 72000,
          priceMax: 76000,
        })
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const loadPredictions = async () => {
      try {
        resp.value = await communityService.pricePrediction.all()
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const init = () => {
      loadPredictions()
      // createPrediction()
    }

    onMounted(init)

    return {
      resp,
    }
  },
}
</script>

<style lang="scss" scoped>
.price-predictions {
  display: grid;
  gap: 16px;
}
</style>