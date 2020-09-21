/*
 * 资源解析
 * 样式增强
 * 目录清理
 * 多页面打包
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清除之前的dist目录下需要变更的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 压缩html
const glob = require('glob'); // 获取多页面入口目录
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css从js中抽离开
const path = require('path');

// 多页面打包配置
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js')); // 同步方式获取入口目录
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];

      const match = entryFile.match(/src\/(.*)\/index\.js/);
      // match 返回数组 第0项为匹配到的内容 之后为匹配到的子表达式 (.*) 匹配尽可能多的字符
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      return htmlWebpackPlugin.push(
        new HtmlWebpackPlugin({
          filename: `${pageName}.html`, // 输出文件名
          chunks: [pageName],
          template: path.join(__dirname, `src/${pageName}/index.html`), // 模版文件
          title: pageName,
        }),
      );
    });

  return {
    entry,
    htmlWebpackPlugin,
  };
};
const { entry, htmlWebpackPlugin } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js', // js资源使用chunkhash 保证每个入口不同 css使用contenthash
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'], // 注意： mini-css-extract-plugin 插件 讲css提取到单独的文件中 与style-loader互斥，将css文件内容放在style标签内并插入head中
    },
    {
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
        'postcss-loader', // css自动添加兼容前缀
        {
          loader: 'px2rem-loader',
          options: {
            remUnit: 75, // 1rem=75px
            remPrecision: 8,
          },
        },
      ],
    },
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 20480,
          },
        },
      ],
    },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({}),
    // 监控编译异常
    function errorPlugin() {
      // 编译结束执行
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugin),
  stats: 'errors-only', // 异常情况下有日志
};
