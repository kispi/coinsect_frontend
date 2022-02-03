const outputDir = process.env.NODE_ENV === 'production' ? 'dist' : 'dist-dev'
const path = require('path')
const manifest = require(`../${outputDir}/server/ssr-manifest.json`)
const appPath = path.join(__dirname, `../${outputDir}`, 'server', manifest['app.js'])
const App = require(appPath).default

const useApp = async req => await App(req)

module.exports = {
  outputDir,
  useApp,
}