const webpack = require('webpack');
const path = require('path');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['whatwg-fetch',
    './src/index',
  ],
  
  module: {
    devtool: 'source-map',
    loaders: [
      {
        test: /\.js?$/, 
        loader: 'babel',
        exclude: /node_modules/ 
      },
      {
        test:/\.jsx$/, 
        loader: 'babel',
        exclude: /node_modules/ 
      },
      { 
        test: /\.scss$/, 
        loader: 'style!css!sass'
       },{ 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000" 
      },
      { 
        test: /\.jpg$/, 
        loader: "file-loader" 
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js','.jsx']
  },
  output: {
    path: './dist',
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
    new webpack.NoErrorsPlugin(),
    
     /* new CleanWebpackPlugin(['dist'], {
     
      verbose: true, 
      dry: false,
      exclude: ['index.html','server.bundle.js','dbFactory.js','httpService.js']
    })  */
    
   
  ]
};
//path: path.join(__dirname, '/dist')