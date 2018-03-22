'use-strict';

const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {


  plugins: [
    new ManifestPlugin({
      fileName: '../../conf/assets.map',
      writeToFileEmit: true,
    }),
    new MiniCssExtractPlugin({
      filename: path.join('stylesheets', `[name]${isProd ? '.[contenthash]' : ''}.css`),
    }),
  ],

  context: path.resolve(__dirname, 'assets'),

  entry: {
    favicons: 'images/favicons.js',
    styles: 'stylesheets/garnett.scss',
    supportLandingPage: 'pages/support-landing/supportLanding.jsx',
    bundlesLandingPage: 'pages/bundles-landing/bundlesLanding.jsx',
    supportLandingPageOld: 'pages/bundles-landing/support-landing-ab-test/supportLandingOld.jsx',
    contributionsLandingPageAU: 'pages/contributions-landing-au/contributionsLandingAU.jsx',
    contributionsLandingPage: 'pages/contributions-landing/contributionsLanding.jsx',
    regularContributionsPage: 'pages/regular-contributions/regularContributions.jsx',
    oneoffContributionsPage: 'pages/oneoff-contributions/oneoffContributions.jsx',
    contributionsThankYouPage: 'pages/contributions-thank-you/contributionsThankYou.jsx',
    regularContributionsExistingPage: 'pages/regular-contributions-existing/regularContributionsExisting.jsx',
    payPalErrorPage: 'pages/paypal-error/payPalError.jsx',
    googleTagManagerScript: 'helpers/tracking/googleTagManagerScript.js',
  },

  output: {
    path: path.resolve(__dirname, 'public/compiled-assets'),
    chunkFilename: 'webpack/[chunkhash].js',
    filename: `javascripts/[name]${isProd ? '.[chunkhash]' : ''}.js`,
    publicPath: '/assets/',
  },

  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      ophan: 'ophan-tracker-js/build/ophan.support',
    },
    modules: [
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: isProd,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [pxtorem({ propList: ['*'] }), autoprefixer()],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },

  devtool: 'source-map',
};
