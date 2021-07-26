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
import { ref, getCurrentInstance, nextTick, onMounted, onUnmounted } from 'vue'

export default {
  props: ['options'],
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refBody = ref(null)

    const scrollCenter = () => {
      nextTick(() => {
        refBody.value.scrollTop = (refBody.value.scrollHeight - refBody.value.clientHeight) / 2
      })
    }

    onMounted(() => plugins.$bus.$on('open-websocket', scrollCenter))

    onUnmounted(() => plugins.$bus.$off('open-websocket', scrollCenter))

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