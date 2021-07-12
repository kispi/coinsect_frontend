<template>
  <div class="input-phone form-control" :class="{'required': required}">
    <label v-if="label" v-html="$translate(label)"/>
    <div class="input-and-error">
      <div class="input-phone-layout">
        <div
          v-if="callingCode"
          class="calling-code"
          v-html="`+${callingCode}`"/>
        <input
          @keydown="onKeydown"
          maxlength="11"
          v-model="localValue"
          @focus="focusCallback"
          :autocomplete="autocomplete"
          :name="name"
          :readonly="readonly"
          :class="{'required-but-empty': required && !localValue}">
      </div>
      <div class="validation-error" v-html="errorMessage"/>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick, getCurrentInstance } from 'vue'

export default {
  props: {
    required: Boolean,
    readonly: Boolean,
    callingCode: String,
    label: String,
    modelValue: String,
    errorMessage: String,
    name: String,
    autocomplete: String,
    focusCallback: Function,
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const localValue = ref(null)

    const writeLocalValue = () => nextTick(() => localValue.value = props.modelValue)

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
      if (
        (e.keyCode < 48 || e.keyCode > 57) &&
        e.key !== 'Backspace' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'ArrowUp' &&
        e.key !== 'ArrowDown'
      ) {
        e.preventDefault()
        return
      }

      nextTick(() => {
        emit('keydown', e)
        emit('update:modelValue', e.target.value)
        plugins.$bus.$emit('keydown-form-control', e.target)
      })
    }

    onMounted(() => writeLocalValue())

    return {
      localValue,
      onKeydown,
    }
  },
}
</script>

<style lang="scss" scoped>
.input-phone {
  label {
    display: block;
  }

  .input-phone-layout {
    display: flex;
    align-items: center;

    .calling-code {
      flex: 0 0 auto;
      margin-right: 16px;
    }
  }
}
</style>