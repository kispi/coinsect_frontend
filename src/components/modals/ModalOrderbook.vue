<template>
  <div class="modal-orderbook scrollable-body">
    <ModalHeader
      :title="$translate('MODAL_ORDERBOOK')
        .replace('%exchange', options.exchange)
        .replace('%market', options.ticker.$$code)
      "
      @close="$emit('close')"
    />
    <div
      ref="refBody"
      class="body">
      <RealTimeOrderbook
        @load-orderbook="scrollCenter"
        :exchange="options.exchange"
        :market="options.ticker.$$code"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  props: ['options'],
  setup() {
    const refBody = ref(null)

    const scrollCenter = () => {
      setTimeout(() => {
        refBody.value.scrollTop = (refBody.value.scrollHeight - refBody.value.clientHeight) / 2
      }, 100)
    }

    onMounted(scrollCenter)

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