import createApp from './main'

const boot = async ({ app, router, store }) => {
  const storeInitialState = window.INITIAL_DATA

  await router.isReady()
  if (storeInitialState) {
    store.replaceState(storeInitialState)
  }

  app.mount('#app')
}

boot(createApp())