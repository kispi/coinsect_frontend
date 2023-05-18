export default {
  shake: elem => {
    if (!elem) return

    elem.classList.add('shake')
    setTimeout(() => elem.classList.remove('shake'), 500)
  },
}