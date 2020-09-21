const merge = require('webpack-merge');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  plugins: [
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0, // 包需要满足的最小体积
      cacheGroups: { // 此配置覆盖上面配置
        reacts: {
          test: /(react|react-dom)/, // 过滤modules
          chunks: 'all', // async 动态引入的模块 initial 非动态引入的模块 all所有模块
          name: 'reacts',
          priority: 10, // 权重
        },
        commons: {
          minChunks: 2, // 最小引用次数
          chunks: 'all',
          name: 'commons',
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
