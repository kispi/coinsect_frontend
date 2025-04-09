<template>
  <div
    class="modal-input"
    :style="options.style">
    <ModalHeader :title="helpers.translate(options.title)" @close="$emit('close')"/>
    <form class="p-16" @submit.prevent>
      <input
        ref="refInput"
        v-model="inputValue"
        :type="options.inputType"
        :autocomplete="options.autocomplete"
        :placeholder="options.placeholder"
        @keydown.enter="$emit('close', inputValue)"
      >
    </form>
    <div
      v-if="buttons"
      class="buttons">
      <div class="flex-row">
        <button
          @click="btn.handler"
          class="btn"
          :class="btn.class"
          :key="idx"
          v-for="(btn, idx) in buttons"
          v-html="helpers.translate(btn.text)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const { helpers } = useGlobalHooks()

const refInput = ref(null)

const inputValue = ref(null)

const buttons = [{
  text: 'CANCEL',
  class: 'btn-default',
  handler: () => emit('close'),
}, {
  text: 'CONFIRM',
  class: 'btn-primary',
  handler: () => emit('close', inputValue.value),
}]

onMounted(() => {
  if (refInput.value) refInput.value.focus()

  if (props.options.inputValue) inputValue.value = props.options.inputValue
})
</script>