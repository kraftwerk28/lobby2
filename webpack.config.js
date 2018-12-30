'use strict';

const HWP = require('html-webpack-plugin');
const cssExt = require('mini-css-extract-plugin');
const cssMini = require('optimize-css-assets-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

const config = {
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
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png)$/,
        loader: 'file-loader',
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
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

module.exports = env => {
  const dev = env.development;
  console.log('Running in ' +
    (dev ? 'development' : 'production') +
    ' mode.\n'
  );

  config.mode = dev ? 'development' : 'production';
  if (dev) {
    config.plugins.push(
      new EnvironmentPlugin({ 'NODE_ENV': 'development' })
    );
    config.devServer = {
      compress: true,
      host: '0.0.0.0',
      port: 8080,
      overlay: true,
      stats: 'minimal'
    };
    config.devtool = 'source-map';

  } else {
    config.module.rules[1].use[0] = cssExt.loader;
    config.plugins.push(
      new cssMini({}),
      new cssExt({ filename: 'style.css' }),
    );
  }

  return config;
};
