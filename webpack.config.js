'use strict'

const HWP = require('html-webpack-plugin')
const cssExt = require('mini-css-extract-plugin')
const cssMini = require('optimize-css-assets-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const { resolve } = require('path')

const PORT = 8080

module.exports = (env) => {
  const dev = env.development
  const crud = env.crud

  const config = {
    mode: dev ? 'development' : 'production',

    entry: {
      app: './src'
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
    watchOptions: {
      ignored: /node_modules/
    }

  }

  console.log('Running in ' +
    (dev ? 'development' : 'production') +
    ' mode.\n')

  if (dev) {
    config.devServer = {
      port: PORT,
      host: '0.0.0.0',
      contentBase: ['/dist', '/data'].map(dr => __dirname + dr),
      overlay: true,
      stats: 'minimal',
      historyApiFallback: true,
      proxy: [
        {
          context: ['/token', '/visittable', '/schema', '/stats'],
          target: 'http://127.0.0.1:8081',
        },
        { context: '/crud', target: 'http://127.0.0.1:8080/crud.html' }
      ]
    }
    config.devtool = 'eval-source-map'
  } else {
    config.plugins.push(
      new cssMini({}),
      new cssExt({ filename: 'style.css' }),
    )

  }
  if (crud) {
    config.entry.crud = './crud/src/main.js'
    config.plugins.push(new HWP({
      chunks: ['crud'],
      template: './crud/src/crud.html',
      minify: { collapseWhitespace: true },
      filename: 'crud.html',
    }))
  }

  return config
}
