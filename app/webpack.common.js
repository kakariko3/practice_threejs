const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// entryとHtmlWebpackPluginを動的に追加
const getEntries = require('./config/webpack/getEntries');
const buildHtmlWebpackPlugins = require('./config/webpack/buildHtmlWebpackPlugins');
const entries = getEntries('./src/scripts/entries');

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
    ],
  },

  plugins: [
    ...buildHtmlWebpackPlugins(entries, './src/pages'),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
    new CleanWebpackPlugin(),
  ],

  resolve: {
    extensions: ['.ts', '.js'],
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    open: true,
  },
};
