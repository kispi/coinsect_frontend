<template>
  <div
    ref="refEditor"
    class="toast-ui-editor"
  />
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import s3Service from '@/services/s3'
import useLazyLoads from '@/lazy-loads'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const refEditor = ref(null)

    const editor = ref(null)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const { loadToastUIEditor } = useLazyLoads()

    const init = async () => {
      if (typeof toastui === 'undefined') {
        await loadToastUIEditor()
        return init()
      }

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
              const url = await s3Service.upload(file, 'boards/free_board')
              callback(url)
            } catch (e) {
              plugins.$toast.error(e.data.message)
            }
          },
        },
      })
    }

    onMounted(() => {
      setTimeout(init)
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
  .toastui-editor-mode-switch,
  label[for=toastuiAltTextInput],
  input#toastuiAltTextInput {
    display: none !important;
  }

  .toastui-editor-contents {
    z-index: 0;
  }

  .toastui-editor-popup,
  .toastui-editor-dropdown-toolbar {
    z-index: 1;
  }

  .toastui-editor-defaultUI .ProseMirror {
    padding: 16px;
  }

  input {
    border-radius: 4px !important;
    color: var(--black) !important;
    border: 1px solid var(--gs-e0) !important;
  }
}
</style>