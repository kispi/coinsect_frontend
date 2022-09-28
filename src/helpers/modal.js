import { store as $store } from '@/store'
import translate from './translate'

const isOpened = component => $store.getters.modals.find(modal => (modal || {}).component === component) ? true : false

const initModal = (options, component) => new Promise(resolve => {
  if (
    !(options || {}).useMultiOpen &&
    isOpened(component)
  ) return

  $store.commit('addModal', { component, options, resolve })
})

const modal = {
  isOpened,
  basic: options => initModal(options, 'ModalBasic'),
  input: options => initModal(options, 'ModalInput'),
  images: options => initModal(options, 'ModalImages'),
  alert: body => modal.confirm({
    body,
    buttons: [{ text: 'OK', class: 'btn-primary light' }],
  }),
  confirm: arg => initModal((() => {
    const options = arg || {}
    options.title = options.title || '알림'
    options.body = translate(options.body ? `<div class="text-center m-t-16 p-12">${options.body}</div>` : '')
    options.buttons = options.buttons || [
      { text: 'CANCEL', class: 'btn-default' },
      { text: 'CONFIRM', class: options.class ? `btn-${options.class}` : 'btn-primary' },
    ]
    return options
  })(), 'ModalBasic'),
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