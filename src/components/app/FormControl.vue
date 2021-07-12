<template>
  <div class="form-control" :class="{'required': required}">
    <label class="display-block" v-html="$translate(label)"/>
    <div class="input-and-error">
      <input
        v-if="!textarea"
        v-model="localValue"
        :name="name"
        :type="type"
        :min="min"
        :max="max"
        :readonly="readonly"
        :placeholder="$translate(placeholder)"
        :class="{
          'required-but-empty': required && !localValue,
        }"
        :maxlength="maxlength"
        @keydown="onKeydown"
        @focus="focusCallback"
      />
      <textarea
        v-else
        v-model="localValue"
        :name="name"
        :readonly="readonly"
        :placeholder="$translate(placeholder)"
        :class="{
          'required-but-empty': required && !localValue,
        }"
        :maxlength="maxlength"
        @keydown="onKeydown"
      />
      <div class="validation-error"/>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'

export default {
  props: {
    modelValue: String,
    value: String,
    name: String,
    placeholder: String,
    maxlength: Number,
    required: Boolean,
    label: String,
    type: String,
    readonly: Boolean,
    textarea: Boolean,
    min: Number,
    max: Number,
    focusCallback: Function,
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const localValue = ref(null)

    const writeLocalValue = () => nextTick(() => localValue.value = props.modelValue || props.value)

    const onKeydown = e => {
      nextTick(() => {
        emit('keydown', e)
        emit('update:modelValue', e.target.value)
        plugins.$bus.$emit('keydown-form-control', e.target)
      })
    }

    watch(
      () => localValue.value,
      newVal => {
        emit('update:modelValue', newVal)
      },
    )

    watch([
      () => props.modelValue,
      () => props.value,
    ],
      writeLocalValue,
    )

    onMounted(writeLocalValue)

    return {
      localValue,
      onKeydown,
    }
  },
}
</script>