import $store from '@/store'
import helpers from '@/helpers'

const initModal = (options, component) => new Promise(resolve => {
  $store.commit('addModal', { component, options, resolve })
})

const modal = {
  basic: options => initModal(options, 'ModalBasic'),
  images: options => initModal(options, 'ModalImages'),

  // ModalBasic을 confirm 형식 (Yes or No)으로 쓰는 경우의 shorthand (하도 많은 경우라)
  confirm: arg => initModal((() => {
    const options = arg || {}
    options.title = options.title || 'ARE_YOU_SURE'
    options.body = helpers.translate(options.body ? `<div class="text-center m-t-16 p-12">${options.body}</div>` : '')
    options.buttons = options.buttons || [
      { text: 'GO_BACK', class: 'btn-default' },
      { text: 'CONFIRM', class: options.class ? `btn-${options.class}` : 'btn-primary' },
    ]
    return options
  })(), 'ModalBasic'),
  confirmFailureOption: title => initModal({ title }, 'ModalConfirmFailureOption'),
  confirmCancelCheckout: callback => {
    modal.confirm({
      title: 'Are you sure you want to leave this page?',
      body: 'Address settings may not be saved.',
    }).then(idx => {
      if (idx === 1) {
        callback && callback()
      }
    })
  },
  alert: (message, customTitle) => {
    return modal.confirm({
      title: customTitle || 'ALERT',
      body: `<div class="p-l-16 p-r-16">${message}</div>`,
      buttons: [{ text: 'OK', class: 'btn-primary' }],
    })
  },
  custom: ({ options, component }) => initModal(options, component),
  // 다른 메소드들과 달리 모달을 띄우는게 아닌 띄워진 모달의 위치를 화면 가운데로 하는 메소드
  center: dom => {
    setTimeout(() => {
      if (!dom) return

      const rect = dom.getBoundingClientRect()
      dom.style.top = `calc(50% - ${rect.height / 2}px)`
      dom.style.left = `calc(50% - ${rect.width / 2}px)`
    })
  },
}

export default modal