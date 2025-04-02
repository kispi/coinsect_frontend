const createBus = () => {
  const events: { [eventName: string]: Function[] } = {}

  const $on = (eventName: string, handler: Function) => {
    if (!events[eventName]) {
      events[eventName] = []
    }
    events[eventName].push(handler)
  }

  const $off = (eventName: string, handler?: Function) => {
    if (!events[eventName]) return

    if (!handler) {
      delete events[eventName]
    } else {
      events[eventName] = events[eventName].filter(h => h !== handler)

      if (events[eventName].length === 0) {
        delete events[eventName]
      }
    }
  }

  const $emit = (eventName: string, payload?: any) => {
    if (!events[eventName]) return

    events[eventName].forEach(handler => handler(payload))
  }

  return { $on, $off, $emit }
}

export default createBus
