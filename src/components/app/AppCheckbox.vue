<template>
  <div
    class="app-checkbox"
    :class="{
      'checked': modelValue,
      'radio-shape': radioShape,
    }"
    @click.stop="onClickCheckbox">
    <i v-if="!radioShape" class="fal fa-check"/>
    <div v-else class="circle"/>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'radioShape'],
  setup(props ,{ emit }) {
    const onClickCheckbox = () => {
      const newVal = props.modelValue !== true
      emit('update:modelValue', newVal)
      emit('change', newVal)
    }

    return {
      onClickCheckbox,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-checkbox {
  border-radius: 2px;
  width: 20px;
  height: 20px;
  background: var(--white);
  border: 1px solid var(--border-base);
  overflow: hidden;
  cursor: pointer;

  .fa-check {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark-gray-lv3);
  }

  &.checked:not(.radio-shape) {
    border: 1px solid var(--white);

    .fa-check {
      color: var(--white);
      background: var(--brand-primary);
      font-weight: 700;
    }
  }

  &.small {
    width: 12px;
    height: 12px;

    .fa-check {
      font-size: 10px;
    }
  }

  &.radio-shape {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    .circle {
      background: var(--brand-primary);
      border-radius: 50%;
      width: 12px;
      height: 12px;
      margin: auto;
    }

    &:not(.checked) {
      .circle {
        display: none;
      }
    }
  }
}
</style>