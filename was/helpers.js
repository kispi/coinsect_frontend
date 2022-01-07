const path = require('path')
const manifest = require('../dist/server/ssr-manifest.json')
const appPath = path.join(__dirname, '../dist', 'server', manifest['app.js'])
const App = require(appPath).default

const useApp = async req => await App(req)

module.exports = {
  useApp,
}