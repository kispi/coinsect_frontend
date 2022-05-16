const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('sw.js')
      console.log(registration.scope)
    } catch (e) {
      console.log(e)
    }
  })
}

registerServiceWorker()