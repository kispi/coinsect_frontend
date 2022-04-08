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
        @load-orderbook="scrollCenter"
        :market="options.market"
      />
      <OrderbookBybit
        v-if="options.exchange === 'bybit'"
        @load-orderbook="scrollCenter"
        :market="options.market"
        :depth="6"
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

    const scrollCenter = () => {
      setTimeout(() => {
        refBody.value.scrollTop = (refBody.value.scrollHeight - refBody.value.clientHeight) / 2
        emit('load-modal-component')
      }, 100)
    }

    return {
      refBody,
      scrollCenter,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-orderbook {
  border-radius: 4px;
  width: 320px;
  height: 480px;

  .body {
    line-height: 20px;
    position: relative;
  }
}
</style>