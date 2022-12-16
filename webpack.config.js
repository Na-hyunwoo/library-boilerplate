const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPrefixer = require('postcss-prefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BANNER = [
  'HW UI LIBRARY',
  '@version ' + pkg.version + ' | ' + new Date().toDateString(),
  '@author ' + pkg.author,
  '@license ' + pkg.license
].join('\n');
const isDevServer = process.env.DEV_SERVER === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const FILENAME = pkg.name + (isProduction ? '.min' : '');



const config = {
  entry: './src/ts/index.ts',
  output: {
    library: ['hui'],
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'eslint-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevServer ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                postcssPrefixer({
                  prefix: 'tui-full-calendar-'
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        use: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, './src/ts/')
    }
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: BANNER,
      entryOnly: true
    }),
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: `${FILENAME}.css`
    }),
    new HtmlWebpackPlugin()
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: false,
    host: '0.0.0.0',
    allowedHosts: 'auto'
  }
};

module.exports = {
  ...config,
  entry: ['./src/sass/index.scss', "./src/ts/index.ts"]
};