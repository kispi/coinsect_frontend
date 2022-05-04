<template>
  <div
    class="app-checkbox"
    :class="{
      'checked': modelValue,
    }"
    @click.stop="onClickCheckbox">
    <i v-if="modelValue" class="fal fa-check"/>
  </div>
</template>

<script>
export default {
  props: ['modelValue'],
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
  width: 16px;
  height: 16px;
  background: var(--white);
  overflow: hidden;
  cursor: pointer;

  .fa-check {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: 700;
    background: var(--brand-primary);
  }
}
</style>