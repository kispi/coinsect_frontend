export default {
  shake: elem => {
    if (!elem) return

    elem.classList.add('shake')
    setTimeout(() => elem.classList.remove('shake'), 500)
  },
  shakeY: elem => {
    if (!elem) return

    elem.classList.add('shake-y')
    setTimeout(() => elem.classList.remove('shake-y'), 500)
  },
}