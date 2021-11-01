const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
//const checkAuth = require('../middleware/check-auth');
const xml2js = require('xml2js');

const Proxe = require('../models/proxe');
const Readkey = require('../models/readkey');
const base64 = require('base-64'); // https://npm.io/package/base-64

/*
const proxeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	hash: String,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date
});

If Proxe with hash is found and not expired, then use response from database.

POST '/obix' uses https.request(...    )   response is XML

Proxe:
	_id: mongoose.Schema.Types.ObjectId,
	hash: String,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date

1. Data from URL is requested

2. If HASH is already in the Proxe =>
	
	if response is expired =>
		fetch URL
		update Proxe (response, updated)
		return response
		
	else
		return response

3. If HASH is NOT in the Proxe => 
		fetch URL
		save response
		return response

4. Cleaning: old entries should be removed, when they are no longer needed.

const Proxe_Save = (po, res)
const Proxe_Update = (po, res)
const Proxe_HTTPS_Fetch = (po, res)
const Proxe_Clean = (hash)

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

const Proxe_Update = (po, res) => {
	const id = po.id;
	const json = po.json;
	//console.log(['json=',json]);
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

const Proxe_HTTPS_Fetch = (po, res) => {
	/*
	po.id				Call has id OR expiration
	po.expiration		Call has id OR expiration
	*/
	const type = po.type;
	const auth = po.auth;
	const xml = po.xml;
	const hash = po.hash;
	const url = po.url;
	const id = po.id;
	const expiration = po.expiration;
	
	//path: '/TestServlet/testHistory/query/'
	//https://ba.vtt.fi/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/query/
	//https://ba.vtt.fi/obixStore/store/Fingrid/emissionFactorOfElectricityProductionInFinland/query/
	const options = {
		//host: '130.188.4.49',
		host: 'ba.vtt.fi',
		port: 443,
		path: url,
		method: 'POST',
		rejectUnauthorized: false, // SEE: https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
		headers: {
			"Content-Type": type,
			"Authorization": auth
		}
	};
	const req2 = https.request(options, (res2) => {
		res2.setEncoding('utf8');
		let rawData = '';
		res2.on('data', (chunk) => { rawData += chunk; });
		res2.on('end', () => {
			try {
				/*
				console.log(['end rawData=',rawData]);
[ 'end rawData=',
  '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">\n<html><head>\n<title>503 Service Unavailable</title>\n</head><body>\n<h1>Service Unavailable</h1>\n<p>The server is temporarily unable to service your\nrequest due to maintenance downtime or capacity\nproblems. Please try again later.</p>\n<hr>\n<address>Apache/2.4.48 (Debian) Server at ba.vtt.fi Port 443</address>\n</body></html>\n' ]
				*/
				if (rawData.indexOf('<!DOCTYPE HTML PUBLIC') === 0) {
					// NOT XML RESPONSE => REJECT.
					console.log('NOT XML RESPONSE!');
					res.status(500).json({error: new Error('NOT XML RESPONSE!')});
					
				} else {
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
				res.status(500).json({error: e});
			}
		});
	});
	req2.on('error', (e) => {
		console.log(['error message=',e.message]);
		//console.error(`problem with request: ${e.message}`);
		res.status(500).json({error: e});
	});
	// Write data to request body (XML)
	req2.write(xml);
	req2.end();
};
/*
	Cleaning must be done to make sure database will not be filled with old obsolete cache entries.
	But since CLEANING and FETCHING are both ASYNCHRONOUS operations, make sure that entry is really 
	OBSOLETE => Use several hours, for example 3 hours.
*/
const Proxe_Clean = (hash) => {
	Proxe.find()
		.exec()
		.then(docs=>{
			//console.log(['Proxe has now ',docs.length,' entries.']);
			docs.forEach(doc => {
				// DO NOT PROCESS the one given as parameter.
				if (doc.hash  === hash) {
					// Exclude this URL.
				} else {
					const upd = doc.updated; // Date object
					const exp_ms = 3*3600*1000; // Cleaning time in milliseconds (3 hours).
					//const exp_ms = 60*1000; // Cleaning time in milliseconds (60 seconds).
					const now = new Date();
					const elapsed = now.getTime() - upd.getTime(); // elapsed time in milliseconds
					if (elapsed > exp_ms) {
						// remove this entry from the database.
						Proxe.deleteOne({_id:doc.id})
							.exec()
							.then(result => {
								console.log('Proxe Entry Removed.');
							})
							.catch(err => {
								console.log(err);
							});
					}
				}
			});
		})
		.catch(err=>{
			console.log(err);
		});
};

const Proxe_Find = (type, auth, xml, hash, url, expiration, res) => {
	// First check if this url is already in database.
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
					Proxe_HTTPS_Fetch({type:type, auth:auth, xml:xml, hash:hash, url:url, id:proxe[0]._id}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				console.log(['Not cached yet => FETCH a FRESH copy! hash=',hash]);
				Proxe_HTTPS_Fetch({type:type, auth:auth, xml:xml, hash:hash, url:url, expiration:expiration}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
};

/*
	const data = { xml: reqXML, auth: authorizationToken, type: 'application/xml'};
*/
/*
curl -u user:pass -s -H "Content-Type: application/xml" -d "<obj is=\"obix:HistoryFilter\" xmlns=\"http://obix.org/ns/schema/1.0\"> name=\"limit\" val=\"3\" /><abstime name=\"start\" val=\"2021-05-03T09:51:15.062Z\"/><abstime name=\"end\" null=\"true\"/></obj>" https://ba.vtt.fi/TestServlet/testHistory/query/
*/
router.post('/obix', (req,res,next)=>{
	const type = req.body.type;
	const readkey = req.body.readkey;
	const xml = req.body.xml;
	const hash = req.body.hash;
	const url = req.body.obix_url;
	const expiration = req.body.expiration_in_seconds;
	//const start = req.body.start;
	//const end = req.body.end;
	
	// base64.encode() is in Browser btoa()
	const base64string = base64.encode(process.env.OBIX_USER+':'+process.env.OBIX_PASS);
	const auth = 'Basic '+ base64string;
	
	//console.log(['auth=',auth]);
	
	Proxe_Clean(hash); // We must exclude requested hash from the cleaning process.
	
	// First check if readkey is defined
	if (typeof readkey !== 'undefined') {
		// Check the validity of Readkey:
		//console.log(['readkey=',readkey]);
		Readkey.findById(readkey)
			.select('_id startdate enddate')
			.exec()
			.then(doc=>{
				if (doc) {
					//doc.startdate
					//doc.enddate
					//console.log('WITH READKEY');
					const now = new Date();
					const e_diffe = doc.enddate.getTime() - now.getTime();
					const s_diffe = now.getTime() - doc.startdate.getTime();
					
					//console.log(['e_diffe=',e_diffe,' s_diffe=',s_diffe]);
					if (e_diffe > 0 && s_diffe > 0) {
						// OK
						Proxe_Find(type, auth, xml, hash, url, expiration, res);
					} else {
						res.status(403).json({message:'Forbidden'});
					}
				} else {
					res.status(404).json({message:'Not Found'});
				}
			})
			.catch(err=>{
				console.log(err);
				res.status(500).json({error:err});
			});
	} else {
		//console.log('WITHOUT READKEY');
		Proxe_Find(type, auth, xml, hash, url, expiration, res);
	}
});

module.exports = router;
