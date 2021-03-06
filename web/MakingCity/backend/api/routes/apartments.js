const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var https = require('https'); // relay?

const checkAuth = require('../middleware/check-auth');

const Readkey = require('../models/readkey');
/*
	Note:
	
	We are just passing the request URL adding Authorization into call.
	
	https://makingcity.vtt.fi/data/sivakka/apartments/last.json?apiKey=12E6F2B1236A
	
	Parameters:
		req.body.url
		req.body.readkey
		req.body.type
		req.body.limit
		req.body.start
		req.body.end
		
	1. Find the given readkey from database.
	2. Check that current timestamp is between readkey's startdate and enddate (readkey is NOT expired).
	3. Construct and perform HTTPS GET for the actual query (url + apiKey + type + start + end).
	
*/
router.post('/feeds/', checkAuth, (req,res,next)=>{
	const readkey = req.body.readkey;
	Readkey.findById(readkey)
		.select('_id startdate enddate')
		.exec()
		.then(doc=>{
			if (doc) {
				//console.log(['doc._id=',doc._id]); // same as readkey
				//console.log(['doc.startdate=',doc.startdate]);
				//console.log(['doc.enddate=',doc.enddate]);
				// Check that current timestamp is between startdate and enddate
				const ts = Date.now();
				const sTS = new Date(doc.startdate);
				const eTS  = new Date(doc.enddate);
				//console.log(['Now=',ts]);
				//console.log(['Start=',sTS.getTime()]);
				//console.log(['End=',eTS.getTime()]);
				if (ts > sTS.getTime() && ts < eTS.getTime()) {
					// OK.
					// Use FAKE key now: '12E6F2B1236A'
					const fakeKey = '12E6F2B1236A';
					let url = req.body.url + '?apiKey='+fakeKey+'&type='+req.body.type;
					if (req.body.limit > 0) {
						url += '&limit='+req.body.limit;
					}
					url += '&start='+req.body.start+'&end='+req.body.end;
					
					const auth = req.headers.authorization;
					const options = {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': auth
						}
					};
					https.get(url, options, (res2) => {
						const { statusCode } = res2;
						const contentType = res2.headers['content-type'];
						
						let error;
						if (statusCode !== 200) {
							error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
						} else if (!/^application\/json/.test(contentType)) {
							error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
						}
						if (error) {
							// Consume response data to free up memory
							res2.resume();
							return res.status(500).json({error: error});
						}
						res2.setEncoding('utf8');
						let rawData = '';
						res2.on('data', (chunk) => { rawData += chunk; });
						res2.on('end', () => {
							try {
								const parsedData = JSON.parse(rawData);
								//console.log(['parsedData=',parsedData]);
								res.status(200).json(parsedData);
							} catch (e) {
								console.log(['error message=',e.message]);
								res.status(500).json({error: e});
							}
						});
						
					}).on('error', (e) => {
						console.log(['error message=',e.message]);
						res.status(500).json({error: e});
					});
					
				} else {
					res.status(404).json({message: 'Readkey Expired'});
				}
			} else {
				res.status(404).json({message:'Readkey not found'});
			}
		})
		.catch(err=>{
			res.status(500).json({error:err});
		});
});

module.exports = router;
