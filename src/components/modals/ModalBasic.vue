<template>
  <div
    class="modal-basic"
    :style="options.style">
    <ModalHeader :title="$translate(title)" :titleClass="titleClass" @close="$emit('close')"/>
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
          {{ $translate(btn.text) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],
  setup(props, { emit }) {
    const buttons = props.options.buttons || []

    return {
      title: props.options.title,
      titleClass: props.options.titleClass,
      body: props.options.body,
      bodyClass: props.options.bodyClass,
      buttons,
      onClickButton: btn => emit('close', buttons.indexOf(btn))
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-basic {
  border-radius: 4px;
  width: 480px;

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