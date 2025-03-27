<template>
  <div class="modal-orderbook scrollable-body f-mono">
    <ModalHeader
      :title="$translate('MODAL_ORDERBOOK')
        .replace('%exchange', options.exchange)
        .replace('%market', options.market)
      "
      @close="$emit('close')"
    />
    <div
      ref="refBody"
      class="body">
      <OrderbookUpbit
        v-if="options.exchange === 'upbit'"
        :market="options.market"
      />
      <OrderbookBybit
        v-if="options.exchange === 'bybit'"
        :market="options.market"
        :depth="options.depth"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: ['options'],
  setup(_, { emit }) {
    const refBody = ref(null)

    return {
      refBody,
    }
  },
}
</script>