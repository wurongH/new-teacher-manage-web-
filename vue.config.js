const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  assetsDir: "static",
  devServer: {
    port: 8091,
    open: true,
    proxy: 'http://10.0.0.52:9051'
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('pages', resolve('src/pages'))
      .set('components', resolve('src/components'))
  }
}
