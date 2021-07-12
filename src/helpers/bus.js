const createBus = () => {
  const events = {}

  const $on = (eventName, handler) => {
    events[eventName] = handler
  }

  const $off = eventName => {
    delete events[eventName]
  }

  const $emit = (eventName, payload) => {
    if (!events[eventName]) return

    events[eventName](payload)
  }

  return {
    $on,
    $off,
    $emit,
  }
}

export default createBus