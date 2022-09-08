import helpers from '@/helpers'

const useLazyLoads = () => {
  const loadGooglePlugins = async () => {
    if (process.env.NODE_ENV !== 'production') return

    await helpers.dom.loadScript({ url: 'https://www.googletagmanager.com/gtag/js?id=G-595H41RVLD' })
    helpers.dom.loadScript({ url: '/scripts/gtm.js' })
    helpers.dom.loadScript({ url: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3069752836489386' })
  }

  const loadToastUIEditor = async () => {
    // 스크립트 로딩 순서 중요 (await 생략 불가)
    await helpers.dom.loadScript({ url: '//uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.js' })
    await helpers.dom.loadScript({ url: '//uicdn.toast.com/editor/latest/toastui-editor-all.min.js' })
    await helpers.dom.loadScript({ url: '//uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.js' })

    return Promise.all([
      helpers.dom.loadLink({
        url: '//uicdn.toast.com/editor/latest/toastui-editor.min.css',
        attributes: [{
          key: 'rel',
          value: 'stylesheet',
        }],
      }),
      helpers.dom.loadLink({
        url: '//uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.css',
        attributes: [{
          key: 'rel',
          value: 'stylesheet',
        }],
      }),
      helpers.dom.loadLink({
        url: '//uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.css',
        attributes: [{
          key: 'rel',
          value: 'stylesheet',
        }],
      }),
    ])
  }

  const loadVendors = async () => {
    await Promise.all([
      helpers.dom.loadScript({ url: 'https://cdn.jsdelivr.net/npm/hangul-js@0.2.6/hangul.min.js' }),
      helpers.dom.loadScript({ url: 'https://s3.tradingview.com/tv.js' }),
      helpers.dom.loadScript({ url: '/scripts/image-resize.min.js' }),
    ])
  }

  const loadDefaults = () => Promise.all([
    loadGooglePlugins(),
    loadVendors(),
  ])

  return {
    loadDefaults,
    loadToastUIEditor,
  }
}

export default useLazyLoads