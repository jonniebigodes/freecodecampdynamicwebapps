var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['whatwg-fetch',
    './src/index',
    
  ],
  /*
  vendor:[
    'history',
    'react',
    'react-dom',
    'react-router',
    'react-redux',
    'redux'
  ],*/

  module: {
    loaders: [
      {
        test: /\.js?$/, 
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
    new webpack.NoErrorsPlugin(),
    
   /*
    new CleanWebpackPlugin(['dist'], {
     
      verbose: true, 
      dry: false,
      exclude: ['index.html']
    }),
     
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity)
    /*
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      entries:['react'],
      chunks:['vendor'],
      minChunks:Infinity
    })
    */
  ]
};