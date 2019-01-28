var path = require('path');
var webpack = require("webpack");
var debug = process.env.NODE_ENV != "production";
//var webpack = require('webpack');
console.log("debug = "+debug);
var path_entry = path.join(__dirname,"assets", "javascripts", "index.js");
var path_out = path.join(__dirname, 'assets', 'public', 'bin')/*process.cwd() + "/assets/public/bin"*/;
console.log(path_entry);
console.log(path_out);
module.exports = {
  // context: __dirname,
  // devtool: debug ? "inline-sourcemap" : null,
  // // devtool: null,
  entry: {
    app: [path_entry] 
  },
  output: { 
    path: path_out, 
    // publicPath: path.join('assets', 'public'),
    publicPath: "/bin/",
    //path: __dirname + "/assets/public/bin",
    filename: "index.js"
  },
  // watch: true, //automatic watching changes and exec compilation
  plugins: debug ? 
    [
    new webpack.HotModuleReplacementPlugin(), 
    ]
   :
    [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  
  module: {
  loaders: [
    {
     test: /\.html$/,
     loader: "raw-loader"
     // loads html using require()
     // http://stackoverflow.com/questions/33183931/how-to-watch-index-html-using-webpack-dev-server-and-html-webpack-plugin
    }
  ]
  }

  // module: {
  //       loaders: [
  //           {
  //               test: /\.js$/,
  //               exclude: /node_modules/,
  //               loader: 'babel',
  //               query: {
  //                   presets: ['es2015']
  //               }
  //           }
  //       ],
  //   }
  // ,module: {
  //       loaders: [
  //           {
  //               test: /\.css$/,
  //               exclude: /node_modules/,
  //               loader: 'style!css'
  //           }
  //       ],
  //   }
};



/*
Just run webpack and it will produce unminified output with sourcemaps.
Run NODE_ENV=production webpack and it will minify the output and de-dupe all the unnecessary code.
https://gist.github.com/learncodeacademy/25092d8f1daf5e4a6fd3#file-webpack-config-js-L13

set NODE_ENV=production
webpack

webpack -w

for production:
webpack -p
or
webpack --optimize-minimize. After running this command, all our bundles will be minified.

*/
