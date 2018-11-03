'use strict';

const HWP = require('html-webpack-plugin');
const cssExt = require('mini-css-extract-plugin');
const cssMini = require('optimize-css-assets-webpack-plugin');

module.exports = (env) => {
  const dev = !env.production;
  console.log('Running in ' + (dev ? 'development' : 'production') + ' mode.\n');
  return {
    mode: dev ? 'development' : 'production',

    resolve: {
      extensions: ['.jsx', '.js', '.scss'],
    },

    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: __dirname + '/dist',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s([ac])ss$/,
          use: [
            dev ? 'style-loader' : cssExt.loader,
            'css-loader',
            'sass-loader'
          ],
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new HWP({
        template: './src/index.html',
        minify: {
          collapseWhitespace: true,
        }
      }),
      ...dev ? [] : [
        new cssMini({}),
        new cssExt({ filename: 'style.css' })
      ]
    ],
    devtool: 'source-map',
    devServer: {
      compress: true,
      host: '0.0.0.0',
      port: 8080,
      overlay: true,
      stats: 'minimal'
    }

  }
};
