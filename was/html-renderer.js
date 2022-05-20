const fs = require('fs')
const path = require('path')
const serialize = require('serialize-javascript')
const { renderToString } = require('@vue/server-renderer')
const { outputDir } = require('./helpers')

const fourSpaces = '    '

// 클라이언트 코드에 에러가 있을 시 이하 동작을 중지하고 SSR 서버로 에러를 전달하기 위한 래퍼. (현재는 500 + /not-found로 떨어트림)
// 만약 문제가 있는 상황이라도 그냥 렌더링을 진행하려면 이거 말고 renderToString(app)을 직접 호출한다.
const renderToStringAsyncWrapper = (app, store) => new Promise((resolve, reject) => {
  app.config.errorHandler = error => {
    if (!error) return

    store.state.errorDuringSSR = error
  }

  renderToString(app).then(() => {
    if (store.state.errorDuringSSR) return reject({
      message: 'Frontend code has a problem',
      clientError: store.state.errorDuringSSR,
    })

    resolve()
  })
})

const useHtmlRenderer = async ({ app, store }) => {
  let appContent
  try {
    appContent = await renderToStringAsyncWrapper(app, store)
  } catch (e) {
    return Promise.reject(e)
  }

  const renderState = `<script>window.INITIAL_DATA = ${serialize(store.state)}</script>`

  const metaXML = Object.keys(store.getters.metaTags).map(metaTagId => {
    const tag = store.getters.metaTags[metaTagId]
    return `<${tag.tag || 'meta'} ${Object.keys(tag).map(key => `${key}="${tag[key]}"`).join(' ')}>`
  }).join(`\n${fourSpaces}`)

  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, `../${outputDir}/client/index.html`),
      (err, html) => {
        if (err) return reject(err)

        appContent = `<div id="app">${appContent}</div>`
  
        html = html
          .toString()
          .replace('<div id="app"></div>', `${renderState}\n${fourSpaces}${appContent}`)
          .replace('<meta-ssr></meta-ssr>', metaXML)
        resolve(html)
      },
    )
  })
}

module.exports = useHtmlRenderer