module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 18080,
    proxy: {
      '/api': {
        // 本地服务接口地址
        target: 'http://172.25.34.237:8080',
        // target: 'http://localhost',
        // 远程演示服务地址
        // target: 'https://saber.bladex.vip/api',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  publicPath: '/'
}
