'use strict'

const { resolve } = require('path')
const { EnvironmentPlugin } = require('webpack')
const CSSExtractPlugin = require('mini-css-extract-plugin')
const CSSOptimizePlugin = require('optimize-css-assets-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const PORT = 8080

module.exports = (env, { mode }) => {
  const dev = mode !== 'production'
  const crud = env && env.crud

  const config = {
    mode: dev ? 'development' : 'production',

    entry: {
      app: './src/'
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
            presets: [
              '@babel/react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ],
          },
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            dev ? 'style-loader' : CSSExtractPlugin.loader,
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
      new HTMLPlugin({
        chunks: ['app'],
        template: './src/index.html',
        minify: { collapseWhitespace: true },
        filename: 'index.html',
      }),
      new EnvironmentPlugin({
        'NODE_ENV': dev ? 'development' : 'production'
      }),
      new CopyPlugin([
        { from: './static/', to: './' }
      ])
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.sass']
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }

  if (dev) {
    config.devServer = {
      port: PORT || 8080,
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
      new CSSOptimizePlugin({}),
      new CSSExtractPlugin({ filename: 'style.css' }),
      new CompressionPlugin({
        test: /\.(js|png|css)$/
      })
    )
  }

  if (crud) {
    config.entry.crud = './crud/src/'
    config.plugins.push(new HTMLPlugin({
      chunks: ['crud'],
      template: './crud/src/crud.html',
      minify: { collapseWhitespace: true },
      filename: 'crud.html',
    }))
  }

  return config
}
