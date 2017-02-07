var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './src/index'
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/, 
        loader: 'babel-loader',
        exclude: /node_modules/ 
      },
      
      { 
        test: /\.s?css$/, loader: 'style!css!sass'
       },
       {
         test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
         loader: 'url-loader?limit=10000'
       }, {
         test: /\.(eot|ttf|wav|mp3)$/,
         loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js','.jsx']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};