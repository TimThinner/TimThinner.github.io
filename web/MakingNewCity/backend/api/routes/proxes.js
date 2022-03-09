const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const xml2js = require('xml2js');

const checkAuth = require('../middleware/check-auth');

const Proxe = require('../models/proxe');
const Readkey = require('../models/readkey');

/*
const Proxe_Save = (po, res) => {
const Proxe_Update = (po, res) => {
const Proxe_HTTP_GET = (po, res) => {
const Proxe_HTTPS_GET = (po, res) => {
const Proxe_Find = (po, res) => {
const Proxe_Clean = (res) => {

router.post('/entsoe', (req,res,next)=>{
router.post('/fingrid', (req,res,next)=>{
router.post('/empo', (req,res,next)=>{
router.post('/sivakkastatus', (req,res,next)=>{
router.get('/clean', (req,res,next)=>{


if proxy cache has valid version (not expired) of this content, it will return
	CACHED response
else 
	
	FETCH a FRESH copy from SOURCE and Update existing Proxe Entry.
	FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
	using Proxe_HTTPS_GET or Proxe_HTTP_GET
	
*/


/*
Proxe_Save
	Save a new proxe entry.
Params:
	po:
		hash
		url
		json
		expiration
	res:
		response object.
*/
const Proxe_Save = (po, res) => {
	const hash = po.hash;
	const url = po.url;
	const json = po.json;
	const expiration = po.expiration;
	
	const now = new Date();
	const proxe = new Proxe({
		_id: new mongoose.Types.ObjectId(),
		hash: hash,
		url: url,
		response: json,
		expiration: expiration,
		updated: now
	});
	proxe
		.save()
		.then(result=>{
			res.status(200).json(json);
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		})
};

/*
Proxe_Update
	Update proxe entry.
Params:
	po:
		id
		json
	res:
		response object.
*/
const Proxe_Update = (po, res) => {
	const id = po.id;
	const json = po.json;
	
	const now = new Date();
	const updateOps = {
		'response': json,
		'updated': now
	};
	// and UPDATE the FRESH copy of response
	Proxe.updateOne({_id:id}, {$set: updateOps})
		.exec() // to get a Promise
		.then(result=>{
			res.status(200).json(json);
		})
		.catch(err=>{
			let msg = 'Error in Proxe.updateOne()';
			if (typeof err.message !== 'undefined') {
				msg += ' err.message='+err.message;
			}
			res.status(500).json({error: msg});
		});
};

/*
	
	 NOTE: The only HTTP resource returns json, but has Content-Type: "text/html; charset=utf-8"
	
*/
const Proxe_HTTP_GET = (po, res) => {
	/*
	po.hash
	po.url
	po.expiration
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	OR
	
	po.hash
	po.url
	po.id
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	application/xml or text/xml
	application/json
	*/
	const hash = po.hash;
	const url = po.url;
	const id = po.id;
	const expiration = po.expiration;
	const options = po.options;
	const response_type = po.response_type;
	
	http.get(url, options, (res2) => {
		
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		//console.log(['contentType=',contentType]); // "text/html; charset=utf-8"
		let ctype = 'json';
		if (response_type === 'xml') {
			 ctype = 'xml';
		}
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed. Status Code: ' + statusCode);
		} /*else if (contentType.indexOf(ctype) === -1) {
			error = new Error('Invalid content-type. Expected ' + ctype + ' but received '+contentType);
		}*/
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
				if (ctype === 'json') {
					// rawData is a JSON string.
					//const parsedData = JSON.parse(rawData);
					if (typeof id !== 'undefined') {
						// Update
						Proxe_Update({id:id, json:rawData}, res);
					} else {
						// Save
						Proxe_Save({hash:hash, url:url, json:rawData, expiration:expiration}, res);
					}
				} else { // xml
					const parser = new xml2js.Parser();
					parser.parseStringPromise(rawData).then(function (result) {
						//console.log(['result=',result]);
						const json = JSON.stringify(result);
						//console.log(['json=',json]);
						if (typeof id !== 'undefined') {
							// Update
							Proxe_Update({id:id, json:json}, res);
						} else {
							// Save
							Proxe_Save({hash:hash, url:url, json:json, expiration:expiration}, res);
						}
					});
				}
			} catch(e) {
				console.log(['error message=',e.message]);
				//console.log(['rawData=',rawData]);
				res.status(500).json({error: e});
			}
		});
	}).on('error', (e) => {
		console.log(['error message=',e.message]);
		res.status(500).json({error: e});
	});
};

const Proxe_HTTPS_GET = (po, res) => {
	/*
	po.hash
	po.url
	po.expiration
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	OR
	
	po.hash
	po.url
	po.id
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	application/xml or text/xml
	application/json
	*/
	const hash = po.hash;
	const url = po.url;
	const id = po.id;
	const expiration = po.expiration;
	const options = po.options;
	const response_type = po.response_type;
	const parse = po.parse;
	
	https.get(url, options, (res2) => {
		
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		
		let ctype = 'json';
		if (response_type === 'xml') {
			 ctype = 'xml';
		}
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed. Status Code: ' + statusCode);
		} else if (contentType.indexOf(ctype) === -1) {
			error = new Error('Invalid content-type. Expected ' + ctype + ' but received '+contentType);
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
				if (ctype === 'json') {
					// rawData is a JSON string.
					
					
					// Todo: add JSON parse for rawdata if requested.
							//	const parsedData = JSON.parse(rawData);
								//console.log(['parsedData=',parsedData]);
							//	res.status(200).json(parsedData);
					console.log(['rawData=',rawData]);
					//[ 'rawData=','[{"created_at":"2022-02-08T23:59:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":18562.673,"impulseLastCtr":11,"impulseTotalCtr":18562673}]' ]
					if (typeof id !== 'undefined') {
						// Update
						Proxe_Update({id:id, json:rawData}, res);
					} else {
						// Save
						Proxe_Save({hash:hash, url:url, json:rawData, expiration:expiration}, res);
					}
				} else { // xml
					const parser = new xml2js.Parser();
					parser.parseStringPromise(rawData).then(function (result) {
						//console.log(['result=',result]);
						const json = JSON.stringify(result);
						//console.log(['json=',json]);
						if (typeof id !== 'undefined') {
							// Update
							Proxe_Update({id:id, json:json}, res);
						} else {
							// Save
							Proxe_Save({hash:hash, url:url, json:json, expiration:expiration}, res);
						}
					});
				}
			} catch(e) {
				console.log(['error message=',e.message]);
				console.log(['rawData=',rawData]);
				res.status(500).json({error: e});
			}
		});
	}).on('error', (e) => {
		console.log(['error message=',e.message]);
		res.status(500).json({error: e});
	});
};

/*
Proxe_Find
	Find proxe entry.
Params:
	po:
		hash
		url
		expiration
		type
		useHttps
	res:
		response object.
*/
const Proxe_Find = (po, res) => {
	// First check if this hash is already in database.
	const hash = po.hash;
	const useHttps = po.useHttps;
	
	Proxe.find({hash:hash})
		.exec()
		.then(proxe=>{
			if (proxe.length >= 1) {
				// FOUND! Check if it is expired.
				const upd = proxe[0].updated; // Date object
				const exp_ms = proxe[0].expiration*1000; // expiration time in milliseconds
				const now = new Date();
				const elapsed = now.getTime() - upd.getTime(); // elapsed time in milliseconds
				//console.log(['elapsed=',elapsed,' exp_ms=',exp_ms]);
				if (elapsed < exp_ms) {
					// Use CACHED version of RESPONSE
					console.log('USE CACHED response!');
					res.status(200).json(proxe[0].response);
				} else {
					console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					const po_with_id = po;
					po_with_id.id = proxe[0]._id;
					if (useHttps) {
						Proxe_HTTPS_GET(po_with_id, res);
					} else {
						Proxe_HTTP_GET(po_with_id, res);
					}
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				console.log(['Not cached yet => FETCH a FRESH copy! hash=',hash]);
				if (useHttps) {
					Proxe_HTTPS_GET(po, res);
				} else {
					Proxe_HTTP_GET(po, res);
				}
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
};

/*
	Cleaning must be done to make sure database will not be filled with old obsolete cache entries.
	But since CLEANING and FETCHING are both ASYNCHRONOUS operations, make sure that entry is really 
	OBSOLETE => Use for example 1 hours.
*/
const Proxe_Clean = (res) => {
	Proxe.find()
		.exec()
		.then(docs=>{
			console.log(['Proxe has now ',docs.length,' entries.']);
			const trash = [];
			docs.forEach(doc => {
				const upd = doc.updated; // Date object
				const exp_ms = 3600*1000; // Cleaning time in milliseconds (1 hour).
				const now = new Date();
				const elapsed = now.getTime() - upd.getTime(); // elapsed time in milliseconds
				if (elapsed > exp_ms) {
					// add this doc.id into trash array
					trash.push(doc.id);
				}
			});
			const num = trash.length;
			if (num > 0) {
				Proxe.deleteMany({
					"_id": {
						$in:trash
					}
				})
				.exec()
				.then(result => {
					const message = num + ' entries cleaned OK.';
					console.log(message);
					res.status(200).json({message:message});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({error:err});
				});
			} else {
				const message = 'Nothing to clean.';
				console.log(message);
				res.status(200).json({message:message});
			}
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
};


router.post('/fingrid', (req,res,next)=>{
	// req.body.url
	// req.body.expiration_in_seconds
	const options = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': process.env.FINGRID_API_KEY
		}
	};
	const po = {
		hash: req.body.url,
		useHttps: true,
		url: req.body.url,
		options: options,
		expiration: req.body.expiration_in_seconds,
		response_type: 'json',
		parse: false
	}
	Proxe_Find(po,res);
});

/*
url = ['https://transparency.entsoe.eu/api?securityToken=' securityToken ...
       '&documentType=' documentType ...
       '&' domainzone '=' in_Domain ...
       '&out_Domain=' in_Domain ...
       '&periodStart=' periodStart ...
       '&periodEnd=' periodEnd] ;


[ 'entsoe url=',
  'https://transparency.entsoe.eu/api?securityToken=9f2496b9-6f5e-4396-a1af-263ffccd597a&documentType=A44&in_Domain=10YFI-1--------U&periodStart=202112011300&periodEnd=202112021300' ]
*/

router.post('/entsoe', (req,res,next)=>{
	// 'https://transparency.entsoe.eu/api
	let url = req.body.url + '?securityToken=' + process.env.ENTSOE_API_KEY;
	// req.body.url
	// req.body.document_type
	// req.body.psr_type
	// req.body.domain
	// req.body.period_start
	// req.body.period_end
	// req.body.expiration_in_seconds  We are using a cache now!
	
	// documentType = 'A75' Actual generation per type	domainzone = 'In_Domain'
	// documentType = 'A65' System total load			domainzone = ‘outBiddingZone_Domain’
	
	url += '&documentType=' + req.body.document_type; // A44 or A65 or A75
	
	if (req.body.document_type !== 'A44') {
		url += '&processType=A16';
	}
	if (req.body.document_type === 'A75') {
		url += '&psrType=' + req.body.psr_type;
	}
	let domainzone;
	if (req.body.document_type === 'A65') {
		domainzone = '&outBiddingZone_Domain=' + req.body.domain;
	} else {
		domainzone = '&in_Domain=' + req.body.domain;
	}
	url += domainzone;
	// GET /api?documentType=A44&in_Domain=10YCZ-CEPS-----N&out_Domain=10YCZ-CEPS-----N&periodStart=201512312300&periodEnd=201612312300
	if (req.body.document_type === 'A44') {
		url += '&out_Domain=' + req.body.domain;
	}
	url += '&periodStart=' + req.body.period_start;   // yyyyMMddHHmm
	url += '&periodEnd=' + req.body.period_end;       // yyyyMMddHHmm
	
	console.log(['entsoe url=',url]);
	const options = {};
	
	const po = {
		hash: url,
		useHttps: true,
		url: url,
		options: options,
		expiration: req.body.expiration_in_seconds,
		response_type: 'xml',
		parse: false
	};
	Proxe_Find(po, res);
});

router.post('/empo', (req,res,next)=>{
	// req.body.url
	// req.body.expiration_in_seconds;
	const url = 'http://128.214.253.150/api/v1/resources/' + req.body.url;
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const po = {
		hash: url,
		useHttps: false,
		url: url,
		options: options,
		expiration: req.body.expiration_in_seconds,
		response_type: 'json',
		parse: false
	};
	Proxe_Find(po, res);
});

/*
	INPUT:
	req.body.url
	req.body.expiration_in_seconds
*/
router.post('/sivakkastatus', (req,res,next)=>{
	// req.body.url						MANDATORY
	// req.body.expiration_in_seconds	MANDATORY
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	// Proxe_Find uses 'hash' and 'useHttps'
	const po = {
		hash: req.body.url,
		useHttps: true,
		url: req.body.url,
		options: options,
		expiration: req.body.expiration_in_seconds,
		response_type: 'json',
		parse: false
	};
	Proxe_Find(po, res);
});

/*
INPUT:
	req.body.readkey
	req.body.url
	req.body.type
	req.body.limit
	req.body.start
	req.body.end
	req.body.expiration_in_seconds
*/
router.post('/apafeeds', checkAuth, (req,res,next)=>{
	const readkey = req.body.readkey;
	Readkey.findById(readkey)
		.select('_id startdate enddate')
		.exec()
		.then(doc=>{
			if (doc) {
				// Check that current timestamp is between startdate and enddate
				const ts = Date.now();
				const sTS = new Date(doc.startdate);
				const eTS  = new Date(doc.enddate);
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
					const po = {
						hash: url,
						useHttps: true,
						url: url,
						options: options,
						expiration: req.body.expiration_in_seconds,
						response_type: 'json',
						parse: true
					};
					Proxe_Find(po, res);
					
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

router.get('/clean', (req,res,next)=>{
	Proxe_Clean(res);
});

module.exports = router;
