<template>
  <div
    ref="refModal"
    class="modal-game scrollable-body">
    <ModalHeader :title="helpers.translate(options.game.title)" @close="$emit('close')"/>
    <div class="body">
      <component
        :is="options.game.component"
        @next-state="helpers.modal.center(refModal)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  options: {
    type: Object,
    required: true,
  },
})

const { helpers } = useGlobalHooks()

const refModal = ref(null)
</script>