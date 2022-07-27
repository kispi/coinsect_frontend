<template>
  <div
    ref="refEditor"
    class="toast-ui-editor"
  />
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import s3Service from '@/services/s3'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const refEditor = ref(null)

    const editor = ref(null)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const init = () => {
      if (typeof toastui === 'undefined') return

      const { Editor } = toastui

      const { colorSyntax } = Editor.plugin

      editor.value = new Editor({
        el: refEditor.value,
        plugins: [colorSyntax],
        initialEditType: 'wysiwyg',
        initialValue: (props.modelValue || ''),
        events: {
          change: () => {
            const html = editor.value.getHTML()
            emit('update:modelValue', html)
          },
        },
        hooks: {
          addImageBlobHook: async (file, callback) => {
            try {
              const url = await s3Service.upload(file, props.path)
              callback(url)
            } catch (e) {
              plugins.$toast.error('이미지 업로드에 실패하였습니다. 다시 시도해주세요.')
            }
          },
        },
      })
    }

    onMounted(() => {
      setTimeout(init, 50)
    })

    onUnmounted(() => {
      if (editor.value) editor.value.destroy()
    })

    return {
      refEditor,
    }
  },
}
</script>

<style lang="scss">
.toast-ui-editor {
  .toastui-editor-mode-switch {
    display: none !important;
  }

  .toastui-editor-contents {
    z-index: 0;
  }

  input {
    border-radius: 4px !important;
    color: var(--black) !important;
    border: 1px solid var(--gs-e0) !important;
  }
}
</style>