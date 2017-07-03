var path 	 	 = require('path')
, 	sqlite3 	 = require('sqlite3').verbose()
, 	db 			 = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'))
, 	helper   	 = require('utils');
module.exports = function(app) {

	app.get('/admin', function (req,res){
		res.render('admin/home', {
			path: req.path,
			user : 'dw'
		});
	})

	app.get('/admin/ujian', function (req,res){
		res.render('admin/ujian', {
			path: req.path,
			user : 'dw'
		});
	})

	app.get('/admin/soal', function (req,res){
		console.log('bank soal')
	})

	app.get('/admin/pengguna', function(req,res){
		db.all("SELECT * FROM main_posts WHERE wdyw='2'", function(err, rows) {
			//var r = db.all("SELECT * FROM main_posts WHERE wdyw='1' AND ")
		    if (!err) {
				res.render('admin/pengguna', {
					path: req.path,
					pengguna : rows,
					useringroup: function(w) {
						//return w;
						var t = 0;
						var l = 0;
						db.all("SELECT * FROM main_posts WHERE wdyw='1' AND identity= $w", { $w: w }, function(err, result){
							
							t += 1;
						})
						console.log(t)
					}
		  		})
		    }
		})
	})

	app.get('/damn', function (req,res){
        db.each("SELECT * FROM main_users", function(err, rows) {
            if (!err) {
                console.log(rows);
            }
        })
	})

}