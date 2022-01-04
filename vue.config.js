const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  chainWebpack: webpackConfig => {
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
      // This is required for repl.it to play nicely with the Dev Server
      webpackConfig.devServer.disableHostCheck(true)
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