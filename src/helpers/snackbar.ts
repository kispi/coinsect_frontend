import { SnackbarOptions } from '@/types'
import { store } from '@/store'

const renderSnackbar = (snackbar: SnackbarOptions) => {
  store.commit('addSnackbar', snackbar)
  if (snackbar.duration === -1) return

  setTimeout(() => store.commit('removeSnackbar', snackbar), snackbar.duration || 10000)
}

const snackbar = {
  info: (html: string) => renderSnackbar({ html, class: 'info' }),
  warning: (html: string) => renderSnackbar({ html, class: 'warning' }),
}

export default snackbar