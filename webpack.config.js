'use strict';

const HWP = require('html-webpack-plugin');
const cssExt = require('mini-css-extract-plugin');
const cssMini = require('optimize-css-assets-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const { resolve } = require('path');

module.exports = (env) => {
  const dev = env.development;
  const crud = env.crud;

  const config = {
    mode: dev ? 'development' : 'production',

    entry: {
      app: './src/main.js'
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
            plugins: [
              'react-hot-loader/babel',
              '@babel/plugin-proposal-class-properties'
            ],
          },
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            dev ? 'style-loader' : cssExt.loader,
            'css-loader',
            'sass-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'assets',
          }
        }
      ]
    },
    plugins: [
      new HWP({
        chunks: ['app'],
        template: './src/index.html',
        minify: { collapseWhitespace: true },
        filename: 'index.html',
      }),
      new EnvironmentPlugin({ 'NODE_ENV': dev ? 'development' : 'production' })
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.sass']
    },

  };

  console.log('Running in ' +
    (dev ? 'development' : 'production') +
    ' mode.\n');

  if (dev) {
    config.devServer = {
      compress: true,
      host: '0.0.0.0',
      port: 8080,
      contentBase: ['/dist', '/data'].map(_ => __dirname + _),
      overlay: true,
      stats: 'minimal',
      historyApiFallback: true,
      proxy: [{
        context: ['/token', '/visittable', '/schema'],
        target: 'http://localhost:8081',
      }]
    };
    config.devtool = 'source-map';
    if (crud) {
      config.entry.crud = './crud/src/main.js';
      config.plugins.push(new HWP({
        chunks: ['crud'],
        template: './crud/src/crud.html',
        minify: { collapseWhitespace: true },
        filename: 'crud.html',
      }));
    }

  } else {
    config.plugins.push(
      new cssMini({}),
      new cssExt({ filename: 'style.css' }),
    );

  }

  return config;
};
