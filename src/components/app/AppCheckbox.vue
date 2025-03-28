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

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const onClickCheckbox = () => {
  const newVal = props.modelValue !== true
  emit('update:modelValue', newVal)
  emit('change', newVal)
}
</script>

<style lang="scss" scoped>
.app-checkbox {
  border: 1px solid var(--border-base);
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