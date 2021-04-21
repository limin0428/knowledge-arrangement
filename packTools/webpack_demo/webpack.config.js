const path = require('path');
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
          }
        }
      }
    ]
  }
}