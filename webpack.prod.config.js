const config = require('./webpack.config.js');
const webpack = require('webpack');

config.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production")
    }
  })
);

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    comments:false,
    //added for compression
    mangle:true,
    //
    compress: {
      warnings: false,
      //added for compression
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: false,
      screw_ie8: true, 
    }
  })
);

config.plugins.push(
  new webpack.optimize.DedupePlugin()
);
/*
config.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      entries:['history',
                'react',
                'react-dom',
                'react-router',
                'react-redux',
                'redux'],
      chunks:['vendor'],
      minChunks:Infinity
    })
);*/
module.exports = config;