const path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './cli.ts',
  target: 'node',
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
        "@cli/commands": "./packages/cli/commands/index"
    },
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};