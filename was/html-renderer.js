const fs = require('fs')
const path = require('path')
const serialize = require('serialize-javascript')
const { renderToString } = require('@vue/server-renderer')
const { outputDir } = require('./helpers')

const fourSpaces = '    '

const useHtmlRenderer = async ({ app, store }) => {
  let appContent = await renderToString(app)

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