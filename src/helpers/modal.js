import $store from '@/store'

const initModal = (options, component) => new Promise(resolve => {
  $store.commit('addModal', { component, options, resolve })
})

const modal = {
  basic: options => initModal(options, 'ModalBasic'),
  images: options => initModal(options, 'ModalImages'),
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