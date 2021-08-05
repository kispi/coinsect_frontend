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

export default {
  components: {
    GameColorSense,
    GameFlipCoin,
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

<style lang="scss" scoped>
.modal-game {
  width: 480px;

  @media (min-width: 768px) {
    width: 720px;
  }
}
</style>