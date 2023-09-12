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

    // ref를 쓰면 prototype이 오염되는건지 editor에 달린 메소드들이 제대로 작동하지 않음
    let editor = null

    const { plugins } = useGlobalHooks()

    const { loadToastUIEditor } = useLazyLoads()

    const autoResizeAbove = 10 * Math.pow(2, 20)

    const createCustomHTMLRenderer = () => {
      const iconYoutube = document.createElement('span')
      iconYoutube.style = 'cursor: pointer;'

      const icon = document.createElement('img')
      icon.setAttribute('src', 'https://www.svgrepo.com/show/13671/youtube.svg')
      icon.setAttribute('width', '32')
      iconYoutube.appendChild(icon)

      const popupYoutube = document.createElement('div')

      const helpImage = document.createElement('img')
      helpImage.src = 'https://d1085v6s0hknp1.cloudfront.net/boards/free_board/557c925f-e7ff-4a2b-a215-fc66021a6e0f_image.png'
      helpImage.style = 'width: 320px; max-width: 100%; margin-bottom: 16px; border: 1px solid var(--border-base); border-radius: 4px;'

      const button = document.createElement('div')
      button.classList.add('btn')
      button.classList.add('btn-primary')
      button.classList.add('m-l-8')
      button.textContent = plugins.$translate('CONFIRM')

      const urlInput = document.createElement('input')
      urlInput.style.width = '100%'
      urlInput.placeholder = 'YouTube Link'

      const row = document.createElement('div')
      row.style = 'display: flex;'

      popupYoutube.appendChild(helpImage)
      row.appendChild(urlInput)
      row.appendChild(button)
      popupYoutube.appendChild(row)

      button.addEventListener('click', () => {
        const url = plugins.$helpers.youtube.extractVideoId(urlInput.value)
        if (!url) return plugins.$toast.error('INVALID_YOUTUBE_URL')

        const str = `<div class="youtube-container-size-limiter"><div class="youtube-ratio-wrapper">
          <iframe
            width="100%"
            src="https://www.youtube.com/embed/${url}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div></div>`

        editor.changeMode('markdown')
        editor.insertText('<p></p>')
        editor.insertText(str)
        editor.insertText('<p></p>')
        editor.changeMode('wysiwyg')
        editor.eventEmitter.emit('closePopup')
        urlInput.value = ''
      })

      iconYoutube.addEventListener('click', () => {
        setTimeout(() => urlInput.focus())
      })

      return { iconYoutube, popupYoutube }
    }

    const init = async () => {
      if (typeof toastui === 'undefined') {
        await loadToastUIEditor()
        return init()
      }

      const { iconYoutube, popupYoutube } = createCustomHTMLRenderer()

      const { Editor } = toastui

      const { colorSyntax } = Editor.plugin

      editor = new Editor({
        el: refEditor.value,
        plugins: [colorSyntax],
        toolbarItems: [
          ['bold', 'italic', 'strike'],
          ['image', 'link'],
          [{
            name: 'YouTube',
            tooltip: 'YouTube',
            el: iconYoutube,
            popup: {
              body: popupYoutube,
              style: { width: 'auto' },
            },
          }],
        ],
        customHTMLRenderer: {
          htmlBlock: {
            iframe: node => [
              { type: 'openTag', tagName: 'iframe', attributes: node.attrs },
              { type: 'html', content: node.childrenHTML },
              { type: 'closeTag', tagName: 'iframe' },
            ],
            div: node => [
              { type: 'openTag', tagName: 'div', attributes: node.attrs },
              { type: 'html', content: node.childrenHTML },
              { type: 'closeTag', tagName: 'div' },
            ],
          },
        },
        height: '480px',
        initialEditType: 'wysiwyg',
        initialValue: (props.modelValue || ''),
        events: {
          change: () => {
            const html = editor.getHTML()
            emit('update:modelValue', html)
          },
        },
        hooks: {
          addImageBlobHook: async (file, callback) => {
            try {
              const resized = file.size > autoResizeAbove ?
                await plugins.$helpers.logic.resizeImage({ file, width: 1920 }) :
                file
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
      if (editor) editor.destroy()
    })

    return {
      refEditor,
    }
  },
}
</script>

<style lang="scss">
.toast-ui-editor {
  background: var(--white);

  .toastui-editor-mode-switch,
  label[for=toastuiAltTextInput],
  input#toastuiAltTextInput {
    display: none !important;
  }

  .toastui-editor-contents {
    z-index: 0;

    iframe {
      border: 0;
    }
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

  .toastui-editor-defaultUI {
    overflow: hidden;

    .ProseMirror {
      padding: 16px;
    }

    .toastui-editor-contents {
      font-size: 15px;
    }
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