<template>
  <div class="quill">
    <QuillToolbar/>
    <div
      ref="refQuillContent"
      class="quill-content"
      @click="onClickQuillContent"
    />
  </div>
</template>

<script>
import { onMounted, ref, nextTick, getCurrentInstance } from 'vue'
import QuillToolbar from './QuillToolbar'

export default {
  props: {
    modelValue: String,
  },
  components: { QuillToolbar },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refQuillContent = ref(null)

    const quill = ref(null)

    const onTextChange = () => {
      const final = quill.value.getText() ? quill.value.root.innerHTML : ''
      emit('update:modelValue', final)
    }

    const onClickQuillContent = () => {
      if (!refQuillContent.value) return

      const dom = refQuillContent.value.getElementsByClassName('ql-editor')[0]
      if (dom) dom.focus()
    }

    const init = () => nextTick(() => {
      if (!Quill || !document.getElementsByClassName('quill-content')[0]) return

      quill.value = new Quill('.quill-content', {
        modules: {
          toolbar: '#toolbar-container',
        },
        placeholder: plugins.$translate('PLACEHOLDER_CONTENT'),
        theme: 'snow',
      })

      if (quill.value && quill.value.root) {
        quill.value.root.innerHTML = props.modelValue || ''
        quill.value.on('text-change', onTextChange)
      }
    })

    onMounted(init)

    return {
      refQuillContent,
      onClickQuillContent,
    }
  },
}
</script>

<style lang="scss">
@import 'quill.snow';

.quill {
  border: 1px solid var(--border-base);
  border-radius: 4px;

  .quill-content {
    min-height: 320px;
    cursor: text;
  }
}
</style>