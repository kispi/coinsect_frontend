import { store } from '@/store'

const renderSnackbar = snackbar => {
  store.commit('addSnackbar', snackbar)
  if (snackbar.duration === -1) return

  setTimeout(() => store.commit('removeSnackbar', snackbar), snackbar.duration || 10000)
}

const snackbar = {
  info: html => renderSnackbar({ html, class: 'info' }),
  warning: html => renderSnackbar({ html, class: 'warning' }),
}

export default snackbar