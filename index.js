var express = require('express');
var bodyparser = require('body-parser');
var wagner = require('wagner-core');
var path = require('path'); 
var router = express.Router();
var favicon = require('serve-favicon');
var fs = require('fs');
require('./models/models.js')(wagner); 
require('./dependencies/dependencies.js')(wagner); 

expressValidator = require('express-validator'),

console.log(process.env.NODE_ENV);


// https://github.com/lorenwest/node-config/wiki/Common-Usage
var config = require('config');
 
// if(config.strategies.local.enabled)
//   {
//     console.log("local_enabled");
//   };

var debug = process.env.NODE_ENV != "production";


var app = express();
app.use(bodyparser.json());
app.use(expressValidator()); 


wagner.invoke(require('./auth'), { app: app });

app.use('/api/v1', require('./api')(wagner));

app.use(express.static(path.join(__dirname, 'assets/public'),  { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));


var ensureAuthenticated = function(req, res, next){
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
			return next();
	}
	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};
var ensureAdminAuthenticated = function(req, res, next){
	if (req.isAuthenticated()){
		if (req.user.name == 'admin'){
			return next();
		}
	}
	return res.redirect('/#login');
};


app.use('/admin', ensureAdminAuthenticated);
app.use('/admin', express.static(path.join(__dirname, 'assets/admin')));

// views is a directory for all template files
// setting template engine
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/assets/public/images/sale-icon-small.png'));


/* GET home page. route and route template */
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: "Chirp"});
// });
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/reset/:token', function(req, res){
  res.sendFile(__dirname + '/views/reset.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/views/admin.html');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));
/*This tells the browser that it can cache static assets
for two hours.*/
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

// uncomment if using browsersync 
//if (debug){ fs.writeFile(__dirname + '/start.log', 'started')} ;

console.log('Express server listening on port ' + app.get('port'));
