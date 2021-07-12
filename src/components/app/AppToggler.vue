<template>
  <div
    class="app-toggler"
    :class="{'checked': modelValue}"
    @click.stop="onClickCheckbox">
    <span v-if="useOnOff" class="on-off" v-html="modelValue ? 'On' : 'Off'"/>
    <div class="handle"/>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'useOnOff'],
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
.app-toggler {
  --app-toggler-width: 48px;
  --app-toggler-gap: 3px;
  width: var(--app-toggler-width);
  height: calc(var(--app-toggler-width) / 2);
  border-radius: calc(var(--app-toggler-width) / 2);
  position: relative;
  background: var(--gray-light);
  cursor: pointer;

  .on-off {
    position: absolute;
    top: 50%;
    right: calc(var(--app-toggler-gap) * 2);
    transform: translateY(-50%);
    color: var(--white);
    opacity: 0.6;
    font-size: 12px;
    font-weight: 700;
  }

  .handle {
    width: calc(var(--app-toggler-width) / 2 - var(--app-toggler-gap) * 2);
    height: calc(var(--app-toggler-width) / 2 - var(--app-toggler-gap) * 2);
    border-radius: 50%;
    background: var(--white);
    position: absolute;
    top: var(--app-toggler-gap);
    left: var(--app-toggler-gap);
    transition: all 0.1s ease-in-out;
  }

  &.checked {
    background: var(--brand-primary);

    .on-off {
      left: calc(var(--app-toggler-gap) * 2);
      right: initial;
    }

    .handle {
      transition: all 0.1s ease-in-out;
      transform: translateX(calc(var(--app-toggler-width) / 2));
    }
  }
}
</style>