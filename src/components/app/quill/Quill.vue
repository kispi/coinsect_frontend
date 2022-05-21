<template>
  <div class="quill">
    <div
      ref="refQuillContent"
      class="quill-content"
      @click="onClickQuillContent"
    />
  </div>
</template>

<script>
import { onMounted, ref, nextTick, getCurrentInstance } from 'vue'
import quillToolbarOptions from './quill-toolbar-options'

export default {
  props: {
    modelValue: String,
  },
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
      if (typeof Quill === 'undefined' || !document.getElementsByClassName('quill-content')[0]) return

      const fontSize = Quill.import('attributors/style/size')
      Quill.register(fontSize, true)

      quill.value = new Quill('.quill-content', {
        modules: {
          toolbar: quillToolbarOptions,
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
    height: 400px;
    overflow-y: auto;
    cursor: text;
  }
}
</style>