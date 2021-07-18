import toasts from './toasts.json'
import tooltips from './tooltips.json'
import translations from './translations.json'
import protectedWords from './protected-words.json'

const result = {}
const list = [toasts, tooltips, translations, protectedWords]
list.forEach(json => Object.keys(json).forEach(key => result[key] = json[key]))

export default result