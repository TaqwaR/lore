var express = require('express')
var bodyParser = require('body-parser')
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var path=require("path");
var passport = require('passport');
var flash    = require('connect-flash');

//Sets up the Express path
var app = express();
var PORT = process.env.PORT || 8080

// pass passport for configuration
require('./app/config/passport')(passport);

// set up  express application
// Static directory
app.use(express.static("app/public"));

//create application/json parser
var jsonParser = bodyParser.json()

// log every request to the console
app.use(morgan('dev'));
// read cookies (needed for auth)
app.use(cookieParser());


//create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
	extended: false
}));

//parse various different custom JSON types as JSON
app.use(bodyParser.json({type: 'application/**json'}))

//parse some custom thing into a Buffer
app.use(bodyParser.raw({type: 'application/vnd.custom-type'}))

//parse an HTML body into a starting
app.use(bodyParser.text({type: 'text/html'}))

// // Import routes and give the server access to them.
// var routes = require("./app/controllers/controller.js");

// required for passport
app.use(session({
	secret: 'login',
	resave: true,
	saveUninitialized: false
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//REQUIRE ROUTES
// load our routes and pass in our app and fully configured passport
require("./app/routes/api-routes.js")(app, passport);
require("./app/routes/html-routes.js")(app, passport);

app.listen(PORT, function(){
    console.log("App listening on PORT:" + PORT);


})
