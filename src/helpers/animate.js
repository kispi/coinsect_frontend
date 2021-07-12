export default {
  shake: elem => {
    if (!elem) return

    elem.classList.add('shake')
    setTimeout(() => elem.classList.remove('shake'), 1000)
  },
  shakeY: elem => {
    if (!elem) return

    elem.classList.add('shake-y')
    setTimeout(() => elem.classList.remove('shake-y'), 1000)
  },
}