const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopywebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    app: './src/main.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          { loader: "style-loader", options: { injectType: "lazyStyleTag" } },
          'css-loader',
          'sass-loader',
        ],
      }, {
        test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
        use: [ 'url-loader' ]
      }, {
        test: /\.html$/i,
        loader: "html-loader",
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopywebpackPlugin({
      patterns: [
        {
          from: 'src/assets/**/*',
          to: 'assets/[name][ext]',
          
        },
      ],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8000
  }
};
