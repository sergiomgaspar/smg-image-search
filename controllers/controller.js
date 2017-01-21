var mongodb = require( 'mongodb' );
var imgRequest = require( 'request' );
var logger = require('../common/logger');

(function(module) {
	'use strict';
	
	var apiKey = process.env.IMG_API_KEY || 'N/A';
	var maxResults = process.env.MAX_RESULTS || 10;	// Number of results shown
	
	// Exports
	module.exports.testRoute = testRoute;
	module.exports.getImages = getImages;
	module.exports.getLastQueries = getLastQueries;

	// Public Functions

	/* getImages: retrieves list of images from BING API and sends results back to user */
	/* 				Step 1: Insert into MobgoDB database */
	/* 				Step 2: Request info from Bing */
	/* 				Step 3: Return JSON to user */
	/* Example: http://localhost:3000/api/imagesearch/lol%20cats?offset=10 */
	function getImages(req, res) {
		logger.Debug("Received image search request");

		var searchQuery = req.params.SEARCH;
		if (searchQuery === undefined || searchQuery === '' ){
			logger.Debug("No valid search query");
			res.writeHead(200);
			res.write(JSON.stringify({
				result: "Not a valid search query."
			}));
			res.end();
			return;
		}

		var date = new Date();
		var searchDate = date.toISOString();

		var db = req.db;
   		var imageCol = db.collection( 'image-search' );

		//var imageCol = res.db.collection('image-search');
		var imageSearch = {
			searchQuery: searchQuery,
			searchDate: searchDate
		};

		// Assync MongoDB insert
		imageCol.insert(imageSearch, function(err, data) {
			runBingQuery(err, data, req, res)
		});
	};

	/* testRoute: Simple test route */
	function testRoute(req,res) {
		logger.Info('Received Test query');  //res.db;
		res.writeHead(200);
		res.write(JSON.stringify({
			text: "This is a test route."
		}));
		res.end();
	};

	/* getLastQueries: retrieves list of previously done searches from the MongoDB sorted by searchDate desc */
	/* 				Step 1: Search MobgoDB database */
	/* 				Step 2: Return JSON to user */
	/* Example: http://localhost:3000/api/latest/imagesearch */
	function getLastQueries(req, res){
		logger.Debug("Receives a search for last queries");

		var db = req.db;
   		var imageCol = db.collection( 'image-search' );

		imageCol.find(
		{ },
		{ searchQuery: 1, searchDate: 1, _id: 0 }	
		).sort( { searchDate: -1 } )
			.limit(maxResults)
			.toArray(function(err, data) {
				if (err) {
					logger.Error("Could not get data from MongoDB");
					res.status(503);
					res.end();
					return;
				}
				
				logger.Debug("Return size: "+data.length);
				res.writeHead(200);
				res.write(JSON.stringify(data));
				res.end();
		})
	};

	// Private Functions
	function runBingQuery(err, data, req, res){
		if (err){
			logger.Error("Could not insert search query in MongoDB");
			res.status(503);
			res.end();
			return;
		}
		logger.Debug("Running BING QUERY.");
		
		// Get the offset from the URL
		var offset = 0;
		if (isNaN(req.query.offset)) {
			offset = '0';
		} else {
			offset = req.query.offset;
		}

		// Prepare the API call
		var searchParameters = 'q=' + req.params.SEARCH +
			'&count='+maxResults+'&offset=' + offset +
			'&mkt=en-us&safeSearch=Moderate';
		var options = {
			uri: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?' +
			searchParameters,
			headers: {
			'Ocp-Apim-Subscription-Key': apiKey
			}
		};
		
		// Use the request module to call the API and handle the result
		imgRequest(options, function( err, response, body ) {
			// Handle request error
			if (err){
				logger.Error("Error while getting API results");
				res.status(503);
				res.end();
				return;
			}

			// Handle API error
			if (response.statusCode !== 200) {
				logger.Error("API returned invalid status");
				res.writeHead(503);
				res.end(JSON.stringify({"API status":response.statusCode, description:"External API did not return correct results"}));
				return;
			}

			// There are libraries like underscore that can do a better job, but to minimize dependencies i am just
			// going to filter the JSON to an array and stringify it (probably not the most efficient way to do it)
			var resArray = [];
			var resQuery = JSON.parse(body);
			resQuery.value.forEach(function(imageResult){
				resArray.push({
					title: imageResult.name,
					url: imageResult.contentUrl,
					thumbnail: imageResult.thumbnailUrl,
					context: imageResult.hostPageDisplayUrl
				});
			});
			// Parse and filter responses to return
			res.writeHead(200);
			res.end(JSON.stringify(resArray));
		});
	};
	
})(module);

