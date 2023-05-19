<template>
  <div
    ref="refEditor"
    class="toast-ui-editor"
  />
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import s3Service from '@/services/s3'
import useLazyLoads from '@/lazy-loads'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const refEditor = ref(null)

    const editor = ref(null)

    const { plugins } = useGlobalHooks()

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
        toolbarItems: [
          ['bold', 'italic', 'strike'],
          ['image', 'link'],
        ],
        height: '480px',
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
              const resized = file.size > 1048576 ? await plugins.$helpers.logic.resizeImage({ file, width: 1920 }) : file
              const url = await s3Service.upload(resized, 'boards/free_board')
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

  .toastui-editor-popup {
    z-index: 1;
    color: var(--black);
    width: 320px;
    margin-left: 0;

    .toastui-editor-file-select-button {
      white-space: nowrap;
    }
  }

  .toastui-editor-defaultUI .ProseMirror {
    padding: 16px;
  }

  .toastui-editor-defaultUI-toolbar {
    padding: 0;
  }

  input {
    border-radius: 4px !important;
    color: var(--black) !important;
    border: 1px solid var(--gs-e0) !important;
  }
}
</style>