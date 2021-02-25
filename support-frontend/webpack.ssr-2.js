module.exports = {
  mode: 'development',
  entry: {
    ssrServer: './ssrServer.jsx',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2',
    pathinfo: true,
  },
  target: 'node',
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
};
