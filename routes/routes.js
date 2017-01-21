var Localexpress = require( 'express' );
var router = Localexpress.Router();

//var router = require('express');.Router();
// var mongodb = require( 'mongodb' ).MongoClient;

var controller = require('../controllers/controller');
var fs = require('fs');
var logger = require('../common/logger');

// Homepage for the app

router.get( '/', function( req, res ) {
  
  fs.readFile('index.html', function(err, contents) {
		
		if (err) {
            // If cant find the file dont crash the APP (dev choice)
			logger.Error('Cannot read index.html file for home URL');
			res.status(503);
			res.end();
            return;
		}
		
		res.writeHead(200);
		res.write(contents);
		res.end();
	});
	
});

router.get( '/api/imagesearch/:SEARCH', controller.getImages );

router.get( '/api/latest/imagesearch', controller.getLastQueries );

router.get( '/test', controller.testRoute );

// Any unknown route will return a 404 (TODO: render 404 dedicated page)
router.get( '*' , function( req, res ) {
  res.status( 404 );
  res.end();
});

module.exports = router;
