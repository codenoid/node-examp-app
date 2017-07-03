var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express JS' });
});

router.get('/mysql', function(req,res,next) {
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "ayam",
	  database: "my_kafarahdb"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  con.query("SELECT * FROM main_posts", function (err, result) {
	    if (err) throw err;
	    console.log(result);
	  });
	});
})

router.get('/login', function(req,res,next){
	res.render('login');
})

// load view for login
router.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile', {
		user : req.user // get the user out of session and pass to template
	});
});
// do login
	router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
module.exports = router;
