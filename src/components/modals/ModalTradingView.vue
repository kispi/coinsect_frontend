<template>
  <div class="modal-trading-view scrollable-body">
    <ModalHeader
      :title="$translate('MODAL_TRADING_VIEW')
        .replace('%ticker', options.symbol)
      "
      @close="$emit('close')"
    />
    <TradingView :symbol="options.symbol"/>
  </div>
</template>

<script>
export default {
  props: ['options'],
}
</script>

<style lang="scss" scoped>
.modal-trading-view {
  border-radius: 4px;
  width: 720px;
}
</style>