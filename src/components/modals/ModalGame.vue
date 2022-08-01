<template>
  <div
    ref="refModal"
    class="modal-game scrollable-body">
    <ModalHeader :title="$translate(options.game.title)" @close="$emit('close')"/>
    <div class="body">
      <component
        :is="options.game.component"
        @next-state="$helpers.modal.center(refModal)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import GameColorSense from '@/components/common/games/GameColorSense'
import GameFlipCoin from '@/components/common/games/GameFlipCoin'
import GameLots from '@/components/common/games/GameLots'

export default {
  components: {
    GameColorSense,
    GameFlipCoin,
    GameLots,
  },
  props: ['options'],
  setup() {
    const refModal = ref(null)

    return {
      refModal,
    }
  },
}
</script>