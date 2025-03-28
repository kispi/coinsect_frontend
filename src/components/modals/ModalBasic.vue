<template>
  <div
    class="modal-basic"
    :style="options.style">
    <ModalHeader :title="helpers.translate(title)" :titleClass="titleClass" @close="$emit('close')"/>
    <div
      class="body pre-line"
      :class="bodyClass"
      v-html="body"/>
    <div
      v-if="buttons"
      class="buttons">
      <div class="flex-row">
        <button
          class="btn"
          @click="onClickButton(btn)"
          :key="idx"
          v-for="(btn, idx) in buttons"
          :class="btn.class">
          {{ helpers.translate(btn.text) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const { helpers } = useGlobalHooks()

const buttons = props.options.buttons || []
</script>

<style lang="scss" scoped>
.modal-basic {
  border-radius: 4px;
  width: 480px;

  .buttons {
    margin: 16px auto;
    display: table;

    button {
      padding: 12px 40px;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>