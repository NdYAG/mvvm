const path = require('path')

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    library: 'MVVM',
    libraryTarget: 'umd',
    filename: 'mvvm.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '/'),
    port: 9000
  }
}
