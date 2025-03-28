<template>
  <div
    class="app-toggler"
    :class="{
      'checked': modelValue,
      'small': small,
    }"
    @click.stop="onClickCheckbox">
    <div class="handle"/>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: null,
  small: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const onClickCheckbox = () => {
  const newVal = props.modelValue !== true
  emit('update:modelValue', newVal)
  emit('change', newVal)
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
  background: var(--gs-bb);
  cursor: pointer;

  --handle-size: calc(var(--app-toggler-width) / 2 - var(--app-toggler-gap) * 2);
  .handle {
    width: var(--handle-size);
    height: var(--handle-size);
    border-radius: 50%;
    background: var(--white);
    position: absolute;
    top: var(--app-toggler-gap);
    left: var(--app-toggler-gap);
    transition: all 0.25s ease-in-out;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
  }

  &.checked {
    background: var(--brand-primary);

    .on-off {
      left: calc(var(--app-toggler-gap) * 2);
      right: initial;
    }

    .handle {
      transform: translateX(calc(var(--app-toggler-width) / 2));
    }
  }

  &.small {
    --app-toggler-width: 32px;
  }
}
</style>