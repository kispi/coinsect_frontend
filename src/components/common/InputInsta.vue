<template>
  <input
    class="input-insta"
    name="instagram"
    :readonly="readonly"
    @keydown="onKeydown"
    @focus="focusCallback"
    @paste="e => {
      localValue = $helpers.retrieveInstagramIdFromUrlOnPaste(e)
    }"
    v-model="localValue">
</template>

<script>
import { ref, watch, nextTick } from 'vue'

export default {
  props: {
    modelValue: String,
    focusCallback: Function,
    readonly: Boolean,
  },
  setup(props, { emit }) {
    const localValue = ref(null)

    const writeLocalValue = () => {
      localValue.value = (props.modelValue || '').replace(/[^0-9a-zA-Z._]+/g, '')
    }

    watch(
      () => localValue.value,
      newVal => {
        emit('update:modelValue', newVal)
      },
    )

    watch(
      () => props.modelValue,
      writeLocalValue,
    )

    const onKeydown = e => {
      nextTick(() => {
        emit('keydown', e)
        emit('update:modelValue', e.target.value)
      })
    }

    return {
      localValue,
      onKeydown,
    }
  },
}
</script>