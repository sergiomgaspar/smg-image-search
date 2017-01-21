/* 
	Image Search Abstraction Layer for FreeCodeCamp
	by: Sergio Gaspar
	date: 2017/01/20
	
	Create API with the below user stories:
	
	US1: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
	US2: I can paginate through the responses by adding a ?offset=2 parameter to the URL.
	US3: I can get a list of the most recently submitted search strings.
*/

// Dependencies definitions 
var express = require('express');
var fs = require('fs');
var url = require('url');
var mongo = require('mongodb').MongoClient
var url = require('url');

// Application specs
var port = process.env.PORT || 3000;
var isDebug = false;

// Instantiate express
var app = express();

/************ UPDATE DB INFO WITH YOUR OWN... WILL NOT WORK !!!   ************/
// MongoDB specs (NOTE: THE U/P are not correct.. setup your own and set them in the env variables)
// Hint: never upload REAL USER/PASS to GIT_HUB!!!
var dbuser = process.env.DBUSER || 'user';
var dbpassword = process.env.DBPASS || 'pass';
var dbURL = process.env.MONGOURL || 'mongodb://' + dbuser + ':' + dbpassword + '@ds117849.mlab.com:17849/smg-fcc';

// Include extra objects
var logger = require('./common/logger');

/* Connect to MongoDB (only start APP is connection OK) */
/* Use connection pool from MongoClient and connect only once */
mongo.connect(dbURL, function(err, db) {
	if (err) {
		logger.Error('Could not connect to MongoDB');
		throw err;
	}
	
	logger.Info('Connected to MongoDB');
	
	// Attach db object to each request so its accessible directly by the controller
	app.use( function( req, res, next ) {
		req.db = db;
		next();
	});
	logger.Debug("Attach DB Objects to http request");
	
	// Use the app routes
	app.use(require('./routes/routes'));

    logger.Debug('Loaded APP routes');
    
	// Listen on port 3000 by default, IP defaults to 127.0.0.1
	app.listen(port, function(err){
		if (err) {
			logger.Error('Application failed to start');
			throw err;
		}
		logger.Info('Server running at http://127.0.0.1:' + port + '/');
	});
});
