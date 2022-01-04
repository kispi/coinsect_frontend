import createApp from './main'

export default () => {
  const { app, router, store } = createApp()

  return {
    app,
    router,
    store,
  }
}