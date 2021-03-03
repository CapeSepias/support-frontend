const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: {
    ssrServer: './assets/ssrServer.jsx',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2',
    pathinfo: true,
  },
  target: 'node',
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
    namedModules: true,
    runtimeChunk: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          {
            test: /node_modules/,
            exclude: [
              /@guardian\/(?!(automat-modules))/,
            ],
          },
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
      },
    ],
  },
  resolve: {
    alias: {
      // react: 'preact/compat',
      // 'react-dom': 'preact/compat',
      ophan: 'ophan-tracker-js/build/ophan.support',
    },
    modules: [
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },
};
