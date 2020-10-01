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
	
	PARAMS:
							EXAMPLE
		req.body.url		https://makingcity.vtt.fi/data/sivakka/apartments/last.json
		req.body.readkey	5f743b8d49612827a005bd2c
		
		
*/
router.post('/', checkAuth, (req,res,next)=>{
	
	//What if we check the Readkey here and append it to URL?
	
	// check 
	// req.body.url = 
	//
	const readkey = req.body.readkey;
	//Readkey.find({code:regcode_lc})
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
					const url = req.body.url + '?apiKey='+fakeKey; //readkey;
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
							return res.status(500).json({message: error.message});
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
								res.status(500).json({message: e.message});
							}
						});
						
					}).on('error', (e) => {
						console.log(['error message=',e.message]);
						res.status(500).json({message: e.message});
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
