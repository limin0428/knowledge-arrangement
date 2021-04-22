const path = require('path');
const RunPlugin = require('./plugins/run-plugin.js') 
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js' 
  },
  mode: 'development', // development  production
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/, use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
          includes: path.resolve(__dirname, 'src'),
          excludes: /node_modules/
        }
      }
    ]
  },
  plugins: [
    new RunPlugin()
  ]
}