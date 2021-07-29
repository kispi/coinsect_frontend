<template>
  <div
    ref="refModal"
    class="modal-game scrollable-body">
    <ModalHeader :title="$translate(options.game.title)" @close="$emit('close')"/>
    <div class="body">
      <component
        :is="options.game.component"
        @next-level="$helpers.modal.center(refModal)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import GamePickCoin from '@/components/common/games/GamePickCoin'

export default {
  components: {
    GamePickCoin,
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
}
</style>