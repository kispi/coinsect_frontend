const register = async () => {
  if (!navigator.serviceWorker) return

  await navigator.serviceWorker.register('/sw.js')
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    window.__A2HS__.deferredPrompt = e
  })

  window.__A2HS__ = {
    deferredPrompt: null,
    prompt: () => {
      if (!window.__A2HS__.deferredPrompt) return

      window.__A2HS__.deferredPrompt.prompt()
      window.__A2HS__.deferredPrompt = null
    },
  }
}

register()