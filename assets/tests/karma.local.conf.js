/*it exports a function that takes a config
and modifies the config to tell Karma what
configuration options to use.
So this configuration loads four files--
jQuery from a CDN, AngularJS from a CDN,
your directive.js file, and your Mocha test file.*/

module.exports = function(config) {
  config.set({
    files: [
      'http://code.jquery.com/jquery-1.11.3.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.js',
      // For ngMockE2E
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-mocks.js',
      './bin/index.js',
      './test.js',
      { pattern: './templates/*.html', included: false, served: true }
    ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    port: 9876,
    proxies : {
      // '/assessment': 'http://localhost:9876/base/'
      '/': 'http://localhost:9876/base/'
      /*This tells Karma to proxy any request to URL path,
over to Karma's static web server*/
    }
  });
};
/*pattern and served property tells Karma to start a static web server
and be ready to serve any HTML files that
are in the current directory. (To simulate fake backend)
Since you're listening on port 9876,
HTML files will be at the URL localhost:9876/base.
For instance, the template.html file that your [? User ?]
[? Menu ?] directive points to will be accessible
at localhost:9876/base/template.html.
But of course, your directive doesn't use Karma's /base
property.
It uses this path.
But that's what this proxies property is for.
This tells Karma to proxy any request to this URL path,
over to Karma's static web server.*/