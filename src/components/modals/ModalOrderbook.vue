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
    <div class="notice">
      업비트 테마 => 전일 종가 초과: <span class="upbit-up">빨강</span>, 동일: 회색, 미만: <span class="upbit-down">파랑</span><br>
      바이빗 테마 => 파는 주문: <span class="bybit-down">빨강</span>, 사는 주문: <span class="bybit-up">초록</span>
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
  border: 1px solid var(--border-light);

  .body {
    line-height: 20px;
  }

  .notice {
    color: var(--text-stress);
    font-size: 10px;
    line-height: 18px;
    padding: 8px;

    .upbit-up {
      color: var(--price-up-upbit);
    }

    .upbit-down {
      color: var(--price-down-upbit);
    }

    .bybit-up {
      color: var(--price-up-bybit);
    }

    .bybit-down {
      color: var(--price-down-bybit);
    }
  }
}
</style>