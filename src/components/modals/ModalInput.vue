<template>
  <div
    class="modal-input"
    :style="options.style">
    <ModalHeader :title="$translate(options.title)" @close="$emit('close')"/>
    <div class="p-16">
      <input
        ref="refInput"
        v-model="inputValue"
        :type="options.inputType"
        :autocomplete="options.autocomplete"
      >
    </div>
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
          v-html="$translate(btn.text)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const refInput = ref(null)

    const inputValue = ref(null)

    const buttons = [{
      text: 'CANCEL',
      class: 'btn-default',
      handler: () => emit('close')
    }, {
      text: 'CONFIRM',
      class: 'btn-primary',
      handler: () => emit('close', inputValue.value)
    }]

    onMounted(() => {
      if (refInput.value) refInput.value.focus()

      if (props.options.inputValue) inputValue.value = props.options.inputValue
    })

    return {
      refInput,
      inputValue,
      buttons,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-input {
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