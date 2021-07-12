const NODE_ENV = process.env.NODE_ENV
const dist = NODE_ENV === 'development' ? 'dist-dev' : 'dist'

module.exports = {
  outputDir: dist,
  publicPath: '/',
  productionSourceMap: NODE_ENV !== 'production',
}