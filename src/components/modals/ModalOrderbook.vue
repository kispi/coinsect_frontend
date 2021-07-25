<template>
  <div class="modal-orderbook scrollable-body">
    <ModalHeader
      :title="$translate('MODAL_ORDERBOOK')
        .replace('%exchange', options.exchange)
        .replace('%market', options.ticker.$$code)
      "
      @close="$emit('close')"
    />
    <div class="body">
      <RealTimeOrderbook :exchange="options.exchange" :market="options.ticker.$$code"/>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],
}
</script>

<style lang="scss" scoped>
.modal-orderbook {
  border-radius: 4px;
  width: 480px;
  height: 640px;

  .body {
    line-height: 20px;
  }

  .buttons {
    margin: 16px auto;
    display: table;

    button {
      padding: 12px 40px;
      text-transform: initial;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>