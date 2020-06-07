const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './ui',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    path: path.resolve('public'),
    publicPath: "{{ publicPath }}/"
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.ejs'),
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: "ui/assets", to: "assets" }
      ],
    }),
  ],
  devServer: {
    open: true
  }
};
