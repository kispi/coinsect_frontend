<template>
  <div class="modal-trading-view scrollable-body">
    <ModalHeader
      :title="$translate('MODAL_TRADING_VIEW')
        .replace('%ticker', options.symbol)
      "
      @close="$emit('close')"
    />
    <div
      ref="refBody"
      class="body">
      <TradingView :symbol="options.symbol"/>
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

<style lang="scss" scoped>
.modal-trading-view {
  border-radius: 4px;
  width: 720px;
}
</style>