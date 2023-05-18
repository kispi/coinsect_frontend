import helpers from '.'

const logic = {
  onPasteClipboardImage: async (pasteEvent, resolve) => {
    const items = (pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData).items
    const img = items[0]
    if (!img.type.includes('image')) return

    const file = img.getAsFile()
    const reader = new FileReader()
    reader.onload = onloadEvent => {
      pasteEvent.target.blur()
      helpers.modal.custom({
        component: 'ModalUploadImage',
        options: {
          file,
          src: onloadEvent.target.result,
        },
      }).then(resolve)
    }

    const target = file.size > 1048576 ? await helpers.resizeImage({ file, width: 1920 }) : file
    reader.readAsDataURL(target)
  },
}

export default logic