import { ModalOptions } from '@/types'
import { store } from '@/store'
import translate from './translate'

const isOpened = (component: any) => store.getters.modals.find((modal: any) => (modal || {}).component === component) ? true : false

const initModal = (component: string, options?: ModalOptions) => new Promise(resolve => {
  if (
    !(options || {}).useMultiOpen &&
    isOpened(component)
  ) return

  store.commit('addModal', { component, options, resolve })
})

const modal = {
  isOpened,
  basic: (options: ModalOptions) => initModal('ModalBasic', options),
  input: (options: ModalOptions) => initModal('ModalInput', options),
  images: (options: ModalOptions) => initModal('ModalImages', options),
  alert: (body: string) => modal.confirm({
    body,
    buttons: [{ text: 'OK', class: 'btn-primary light' }],
  }),
  confirm: (arg: ModalOptions) => initModal(
    'ModalBasic',
    (() => {
    const options = arg || {}
    options.title = options.title || '알림'
    options.body = translate(options.body ? `<div class="text-center m-t-16 p-12">${options.body}</div>` : '')
    options.buttons = options.buttons || [
      { text: 'CANCEL', class: 'btn-default' },
      { text: 'CONFIRM', class: options.class ? `btn-${options.class}` : 'btn-primary' },
    ]
    return options
  })()),
  custom: ({ options, component }: { options?: ModalOptions, component: any }) => initModal(component, options),
  // 다른 메소드들과 달리 모달을 띄우는게 아닌 띄워진 모달의 위치를 화면 가운데로 하는 메소드
  center: (dom: HTMLElement) => {
    setTimeout(() => {
      if (!dom) return

      const rect = dom.getBoundingClientRect()
      dom.style.top = `calc(50% - ${rect.height / 2}px)`
      dom.style.left = `calc(50% - ${rect.width / 2}px)`
    })
  },
}

export default modal