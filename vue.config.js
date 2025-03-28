const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const path = require('path')
const outputDir = process.env.NODE_ENV === 'production' ? 'dist' : 'dist-dev'

module.exports = {
  outputDir,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  chainWebpack: webpackConfig => {
    webpackConfig.plugin('define').tap(definitions => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
      return definitions
    })

    if (!process.env.VUE_APP_SSR) {
      webpackConfig.resolve.alias.set(
        'vue3-component-library/components',
        path.resolve(__dirname, 'node_modules/vue3-component-library/dist/esm')
      )
    } else {
      webpackConfig.resolve.alias.set(
        'vue3-component-library/components',
        path.resolve(__dirname, 'node_modules/vue3-component-library/dist/cjs')
      )
    }
    if (!process.env.VUE_APP_SSR) {
      webpackConfig
        .entry('app')
        .clear()
        .add('./src/entry-client.js')
      return
    }
  
    webpackConfig
      .entry('app')
      .clear()
      .add('./src/entry-server.js')
  
    webpackConfig.target('node')
    webpackConfig.output.libraryTarget('commonjs2')
  
    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))
  
    webpackConfig.externals(
      nodeExternals({
        allowlist: [/\.(css|vue)$/]
      })
    )
  
    webpackConfig.optimization.splitChunks(false).minimize(false)
  
    webpackConfig.plugins.delete('hmr')
    webpackConfig.plugins.delete('preload')
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('progress')
    webpackConfig.plugins.delete('friendly-errors')
    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    )
  },
}