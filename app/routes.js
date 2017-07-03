module.exports = function(app, passport) {
var sqlite3 = require('sqlite3').verbose();
var path    = require('path');
var db 		= new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));
var fs 		= require('fs');
var bcrypt  = require('bcrypt-nodejs');

	app.get('/', function(req, res) {
		var sess  = req.session;
		console.log(sess.islog)
		if(!sess.islog)
			res.redirect('/login');
		else
			res.redirect('/home');
	});
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') });
	});
	app.post('/login', function(req, res) {
		db.each("SELECT * FROM main_users", function(err, rows) {
		    if (!err) {
		        if(rows.user_key == req.body.username) {
		        	if(bcrypt.compareSync(req.body.password, rows.user_password)) {
		        		// password match
		        		console.log('success log')
						var sess 	= req.session;
		        		sess.ember  = rows.user_key;
            			req.session.cookie.maxAge = 1000 * 60 * 3;
						sess.islog  = 'y';
		        		res.redirect('/home')
		        	}
		        }
		    }
		    else 
		    	res.redirect('/login')
		})
    });
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage') });
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	app.get('/home', function(req, res) {
		var sess  = req.session;
		if(!sess.islog)
			res.redirect('/login');

		var mysql = require('mysql');
		var con = mysql.createConnection({
			host: "localhost",
			user: "root",
		 	password: "ayam",
			database: "latihan_auth"
		});
		con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT * FROM soal", function (err, result) {
		  	// console.log(result)
		    if (err) throw err;
			res.render('home', {
				user : sess.ember, // get the user out of session and pass to template
				soal : result
			});
		  });
		});
	});
	app.get('/encrypt', function(req,res){
		var crypto = require('crypto'),
		    algorithm = 'aes-256-ctr',
		    password = 'd6F3Efeq';

		function encrypt(text){
		  var cipher = crypto.createCipher(algorithm,password)
		  var crypted = cipher.update(text,'utf8','hex')
		  crypted += cipher.final('hex');
		  return crypted;
		}
		 
		function decrypt(text){
		  var decipher = crypto.createDecipher(algorithm,password)
		  var dec = decipher.update(text,'hex','utf8')
		  dec += decipher.final('utf8');
		  return dec;
		}
		 
		var hw = encrypt("hello world")
		console.log(hw)
		// outputs hello world
		console.log(decrypt(hw));
	})

	app.get('/read/:id', function(req,res){
		console.log(req.params.id);
	})

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/mysql', function(req,res) {
		var mysql = require('mysql');
		var con = mysql.createConnection({
			host: "localhost",
			user: "root",
		 	password: "ayam",
			database: "latihan_auth"
		});
		con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT * FROM jawaban", function (err, result) {
		    if (err) throw err;
		    for (var i = 0; i < result.length; i++) {
		    	console.log(result[i].answer);
		    }
		  });
		});
	})

	app.get('/ts', function(req,res){

		var film = {
		    judul: "Keramat",
		    release: "2009",
		    imdb: "http://www.imdb.com/title/tt1495818/",
		    deskripsi: "Film horror paling horror!"
		}

		var filmUpdate = {
		    id: 1,
		    deskripsi: "Best Indonesian Horror Movie."
		}

		// SQL Statement
		var CREATE_TABLE = "CREATE TABLE IF NOT EXISTS fdb ( id INTEGER PRIMARY KEY AUTOINCREMENT, judul TEXT NOT NULL, release TEXT NOT NULL, imdb TEXT, deskripsi TEXT )";
		var INSERT_DATA = "INSERT INTO fdb (judul, release, imdb, deskripsi) VALUES (?, ?, ?, ?)";
		var SELECT_DATA = "SELECT * FROM fdb";
		var UPDATE_DATA = "UPDATE fdb SET deskripsi=$deskripsi WHERE id=$id";
		    db.each('SELECT * FROM lorem', function(err, rows) {
		        if (!err) {
		            console.log(rows.info);
		        }
		    })
		selectAllData();
		// Run SQL one at a time
/*		db.serialize(function() {
		    // Create table
		    db.run(CREATE_TABLE, function(err) {
		        if (err) {
		            console.log(err);
		        } else {
		            console.log('CREATE TABLE');
		        }
		    });

		    db.run(INSERT_DATA, [film.judul, film.release, film.imdb, film.deskripsi], function(err) {
		        if (err) {
		            console.log(err);
		        } else {
		            console.log('INSERT DATA');
		        }
		    });

		    // Query all data
		    selectAllData();

		    // Update data
		    db.run(UPDATE_DATA, {$deskripsi: filmUpdate.deskripsi, $id: filmUpdate.id}, function(err){
		        if(err) {
		            console.log(err);
		        } else {
		            console.log('UDATE DATA');
		        }
		    });

		    selectAllData();

		    db.run('DELETE FROM fdb WHERE id=$id', {$id:1}, function(err){
		        if(err) {
		            console.log(err)
		        } else {
		            console.log("DELETE DATA");
		        };

		    })

		});*/

		function selectAllData() {
		    db.each("SELECT * FROM main_users", function(err, rows) {
		        if (!err) {
		            console.log(rows);
		        }
		    })
		}

	})

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}