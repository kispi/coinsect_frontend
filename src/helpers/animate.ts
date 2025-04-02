export default {
  shake: (elem: HTMLElement) => {
    if (!elem) return

    elem.classList.add('shake')
    setTimeout(() => elem.classList.remove('shake'), 500)
  },
}