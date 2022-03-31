import errors from './errors.json'
import games from './games.json'
import menu from './menu.json'
import modals from './modals.json'
import pages from './pages.json'
import protectedWords from './protected-words.json'
import toasts from './toasts.json'
import tooltips from './tooltips.json'
import translations from './translations.json'

const result = {}
const list = [
  errors,
  games,
  menu,
  modals,
  pages,
  protectedWords,
  toasts,
  tooltips,
  translations,
]
list.forEach(json => Object.keys(json).forEach(key => result[key] = json[key]))

export default result