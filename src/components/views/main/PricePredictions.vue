<template>
  <div class="price-predictions">
    <div class="items pretty-scrollbar">
      <div
        v-if="(($store.getters.pricePredictions || {}).data || []).length === 0"
        class="center f-500 f-16 c-text-stress flex-fill">
        {{ $translate('NO_SEARCH_RESULT') }}
      </div>
      <template v-else>
        <PricePrediction
          :pricePrediction="prediction"
          :key="prediction.sharingKey"
          v-for="prediction in ($store.getters.pricePredictions || {}).data"
        />
      </template>
    </div>
    <button
      class="btn btn-primary"
      @click="$modal.custom({ component: 'ModalCreatePricePrediction' })">
      {{ $translate('CREATE_PREDICTION') }}
    </button>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const timeout = ref(null)

    const callApi = async () => {
      try {
        await store.dispatch('loadPricePredictions')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      } finally {
        timeout.value = setTimeout(callApi, 1000 * 60 * 5)
      }
    }

    const onNewPrediction = message => {
      if (!message.meta) return

      store.getters.pricePredictions.data.unshift(message.meta)
    }

    onMounted(callApi)

    onUnmounted(() => {
      if (timeout.value) clearTimeout(timeout.value)
    })

    watch(
      () => store.getters.chat.lastWebsocketMessage,
      onNewPrediction,
    )
  },
}
</script>

<style lang="scss" scoped>
.price-predictions {
  display: flex;
  flex-direction: column;

  .items {
    display: grid;
    align-content: flex-start;
    overflow-y: auto;
    gap: 2px;
  }

  .btn-primary {
    margin-top: 8px;
    padding: 12px 16px;
  }
}
</style>