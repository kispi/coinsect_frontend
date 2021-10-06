import helpers from '@/helpers'

export default {
  container: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'size': ['10px', false, '18px', '32px'] }],  // custom dropdown
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ['link', 'image'],
  ],
  handlers: {
    image: function() {
      helpers.modal.custom({ component: 'ModalImageUploader' })
        .then(e => {
          if (e) {
            const Delta = Quill.import('delta')
            const range = this.quill.getSelection(true)
            this.quill.updateContents(new Delta().retain(range.index).delete(range.length).insert({ image: e.url }), 'user')
            this.quill.setSelection(range.index + 1, 'silent')
          }
        })
    },
  },
}