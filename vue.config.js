const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 取消eslint组件命名不规范的校验
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://center.hybrid.xiaomi.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      '^/query': {
        target: 'https://api.hybrid.xiaomi.com',
        changeOrigin: true,
        pathRewrite: { '^/query': '' },
      },
      '^/opv': {
        target: 'https://center.jits.heytapmobi.com',
        changeOrigin: true,
        pathRewrite: { '^/opv': '' },
      },
      '^/vivoApi': {
        target: 'https://userapi.quickapp.cn',
        changeOrigin: true,
        pathRewrite: { '^/vivoApi': '' },
      },
    },
  },
});
