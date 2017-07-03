var express  	 = require('express')
, 	session  	 = require('express-session')
, 	cookieParser = require('cookie-parser')
, 	bodyParser 	 = require('body-parser')
, 	morgan   	 = require('morgan')
, 	app      	 = express()
, 	port     	 = process.env.PORT || 8080
, 	colors   	 = require('colors')
, 	passport 	 = require('passport')
, 	flash    	 = require('connect-flash')
, 	path 	 	 = require('path');
/*var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
 	password: "ayam",
	database: "latihan_auth"
});*/
// configuration ===============================================================
// connect to our database

app.get('/ew', function(req,res){
	sess = req.session;
	sess.email ='2';
	console.log(sess.email);
})
app.disable('etag');
require('./config/passport')(passport); // pass passport for configuration
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'pug'); // set up pug for templating
// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/admin.js')(app); // admin routing and app
// launch ======================================================================
app.listen(port); 
console.log('[NES][EXAM] '.blue+'Server aktif'.inverse+' di '+'http://localhost:8080'.underline.green);