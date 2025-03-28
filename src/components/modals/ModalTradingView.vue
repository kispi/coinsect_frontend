<template>
  <div class="modal-trading-view scrollable-body">
    <ModalHeader
      :title="helpers.translate('MODAL_TRADING_VIEW')
        .replace('%ticker', options.symbol)
      "
      @close="$emit('close')"
    />
    <TradingView :symbol="options.symbol"/>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  options: {
    type: Object,
    required: true,
  },
})

const { helpers } = useGlobalHooks()
</script>