var fs = require('fs');
var webpack = require("webpack");
var path = require('path');

var PORT = 8080;


var webpackDevServer = require('webpack-dev-server');

var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
var compiler = webpack(config); 

var server = new webpackDevServer(compiler, {
  contentBase: path.join(__dirname, 'assets','public')	,
  publicPath: "/bin/",
  hot: true,
  quiet: false,
  stats: { colors: true },
  proxy: {
    "*" : "http://localhost:3000" // <- backend
  }
});
server.listen(PORT); 
fs.writeFile(__dirname + '/start.log', 'started'); 