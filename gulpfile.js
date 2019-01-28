var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync').create();


gulp.task('test', function() {
  var error = false;
  gulp.
    src('./test.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded! Enter the below code:\n' +
          require('fs').readFileSync('./output.dat'));
        process.exit(0);
      }
    });
});

gulp.task('watch', ['test'], function() {
  gulp.watch(['./*.js'], ['test']);
});

// Save a reference to the `reload` method
// https://www.browsersync.io/docs/gulp
// Watch scss AND html files, doing different things with each.
// https://www.browsersync.io/docs/gulp - combined task example

gulp.task('bs', function () {
    var reload = browserSync.reload;
    // Serve files from the root of this project
    browserSync.init({
        //server: "./dev_server"
        //Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.
        proxy: "http://localhost:8080/webpack-dev-server/"
    });

    gulp.watch("start.log").on("change", reload);
    // start.log changing every time after the sublime build command fires and server launching


}); 

var nodemon = require('gulp-nodemon');

gulp.task('start_nodemon', function () {
  nodemon({
    script: 'index.js'
  , ignore: ["test.js", "assets/*", "data/*"]
  , ext: 'js json html'
  , env: { 'NODE_ENV': 'development' } 
  })
})

/*will start index.js in development mode and watch for changes, 
as well as watch all .html and .js files in the directory.*/

gulp.task('back_dev_server' , ['start_nodemon'], function () {
    var reload = browserSync.reload;
    // Serve files from the root of this project
    browserSync.init({
        port: 3001,
        //server: "./dev_server"
        //Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.
        proxy: "http://localhost:3000"
    });

    gulp.watch("start.log").on("change", reload);
    // start.log changing every time after the sublime build command fires and server launching
}); 