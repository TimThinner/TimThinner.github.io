const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
//const checkAuth = require('../middleware/check-auth');
const xml2js = require('xml2js');

const Proxe = require('../models/proxe');
/*

We normally use FETCHING update frequencies like once in 3 minutes and the VIEW is usually 
refreshed also once every 3 minutes.
The EXPIRATION time of our (backend) cached data depends on source. Some have 3 minute update 
frequency, some 60 minute update frequency. So that is a configurable parameter:
	
	FingridModel:	expiration_in_seconds: 180 // = 3 minutes
	EntsoeModel:	expiration_in_seconds: 180
	RussiaModel:	expiration_in_seconds: 180
	SwedenModel:	expiration_in_seconds: 180
	
MenuView is refreshed once in 3 minutes (FingridPowerSystemStateModel)				1      model
GridPageChartView is refreshed once in 3 minutes (Fingrid models).					13     models
SolarPageChartView is refreshed once in 3 minutes (Fingrid solar energy forecast).	1      model
EnvironmentPageChartView is refreshed once in 3 minutes (ENTSOE, Sweden, Russia)	34 + 2 models
==============================================================================================
																			TOTAL   51  models

The real benefit of using CACHE in backend is when the number of connecting clients becomes bigger, 
then those limits set in sources can be easily exceeded:

ENTSOE:			Maximum of 400 requests are accepted per user per minute.
				- there are currently 36 models in ENTSOE fetched with 3 minute interval =>
					maximum number of PROXE requests for one minute is 36.
Fingrid API:	You can make 10 000 requests in 24h period with one API-key.
				- there are 480 three minute intervals in 24 hours => 
					maximum number of PROXE requests for 24h hours is: 14 x 480 = 6720.

https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html#_query_via_web_browser

const proxeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date
});

If Proxe with url is found and not expired, then use response from database.

https://hackmd.io/@a-4-1_VUTmKvMu5NlGrXFA/rymQ23M5O#Emissions-data
http://www.bcdcenergia.fi/energiasaa/

POST '/fingrid' uses https.get(url, options ... response is JSON
POST '/russia' uses http.get(url, options, ...  response is JSON
POST '/sweden' uses https.get(url, options, ... response is JSON
POST '/entsoe' uses https.get(url, ...          response is XML

Proxe:
	_id: mongoose.Schema.Types.ObjectId,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date

1. Data from URL is requested

2. If URL is already in the Proxe =>
	
	if response is expired =>
		fetch URL
		update Proxe (response, updated)
		return response
		
	else
		return response

3. If URL is NOT in the Proxe => 
		fetch URL
		save response
		return response

4. Cleaning: old entries should be removed, when they are no longer needed.
*/
const Proxe_Save = (po, res) => {
	const url = po.url;
	const json = po.json;
	const expiration = po.expiration;
	
	const now = new Date();
	const proxe = new Proxe({
		_id: new mongoose.Types.ObjectId(),
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

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
/*if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(str, newStr){
		// If a regex pattern
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}
		// If a string
		return this.replace(new RegExp(str, 'g'), newStr);
	};
}
*/
/*
	When testing response contentType search for 'application/json' or 'text/xml'
*/
const Proxe_HTTP_Fetch = (po, res) => {
	/*
	po.url
	po.expiration
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	OR
	
	po.url
	po.id
	po.options			// 
	po.response_type	// 'json' or 'xml'
	*/
	http.get(po.url, po.options, (res2) => {
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		
		let ctype = 'application/json';
		if (po.response_type === 'xml') {
			 ctype = 'text/xml';
		}
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed. Status Code: ' + statusCode);
		} 
		// NOTE: This API returns Content-Type: text/html; charset=utf-8 => do not check...
		/*else if (contentType.indexOf(ctype) === -1) {
			console.log('Invalid content-type. Expected ' + ctype + ' but received '+contentType);
			error = new Error('Invalid content-type. Expected ' + ctype + ' but received '+contentType);
		}*/
		
		//console.log(['contentType=',contentType]); // "text/html; charset=utf-8"
		
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
				if (ctype === 'application/json') {
					// rawData is a JSON string.
					//const parsedData = JSON.parse(rawData);
					/*
					if (contentType === "text/html; charset=utf-8") {
						const raw = rawData.replace(/\s/g,'');//replaceAll("\\s","");
						//const raw2 = raw.replace(/\\"/g, '"');
						//const rawjson = JSON.parse(raw);
						//const raws = raw.slice(-120);
						//console.log(['raw SLICE=',raws]);
						if (typeof po.id !== 'undefined') {
							// Update
							Proxe_Update({id:po.id, json:raw}, res);
						} else {
							// Save
							//console.log(['url: ',po.url,' rawData=',rawData]);
							Proxe_Save({url:po.url, json:raw, expiration:po.expiration}, res);
						}
					} else {
						if (typeof po.id !== 'undefined') {
							// Update
							Proxe_Update({id:po.id, json:rawData}, res);
						} else {
							// Save
							//console.log(['url: ',po.url,' rawData=',rawData]);
							Proxe_Save({url:po.url, json:rawData, expiration:po.expiration}, res);
						}
					}
					*/
					
					if (typeof po.id !== 'undefined') {
						// Update
						Proxe_Update({id:po.id, json:rawData}, res);
					} else {
						// Save
						//console.log(['url: ',po.url,' rawData=',rawData]);
						Proxe_Save({url:po.url, json:rawData, expiration:po.expiration}, res);
					}
					
					
				} else if (ctype === 'text/xml') {
					const parser = new xml2js.Parser();
					parser.parseStringPromise(rawData).then(function (result) {
						//console.log(['result=',result]);
						const json = JSON.stringify(result);
						//console.log(['json=',json]);
						if (typeof po.id !== 'undefined') {
							// Update
							Proxe_Update({id:po.id, json:json}, res);
						} else {
							// Save
							Proxe_Save({url:po.url, json:json, expiration:po.expiration}, res);
						}
					});
				} else {
					error = new Error('content-type. Expected ' + ctype + ' but received '+contentType);
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

const Proxe_HTTPS_Fetch = (po, res) => {
	/*
	po.url
	po.expiration
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	OR
	
	po.url
	po.id
	po.options			// 
	po.response_type	// 'json' or 'xml'
	
	*/
	https.get(po.url, po.options, (res2) => {
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		
		let ctype = 'application/json';
		if (po.response_type === 'xml') {
			 ctype = 'text/xml';
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
				if (ctype === 'application/json') {
					// rawData is a JSON string.
					//const parsedData = JSON.parse(rawData);
					if (typeof po.id !== 'undefined') {
						// Update
						Proxe_Update({id:po.id, json:rawData}, res);
					} else {
						// Save
						Proxe_Save({url:po.url, json:rawData, expiration:po.expiration}, res);
					}
				} else if (ctype === 'text/xml') {
					const parser = new xml2js.Parser();
					parser.parseStringPromise(rawData).then(function (result) {
						//console.log(['result=',result]);
						const json = JSON.stringify(result);
						//console.log(['json=',json]);
						if (typeof po.id !== 'undefined') {
							// Update
							Proxe_Update({id:po.id, json:json}, res);
						} else {
							// Save
							Proxe_Save({url:po.url, json:json, expiration:po.expiration}, res);
						}
					});
				} else {
					error = new Error('content-type. Expected ' + ctype + ' but received '+contentType);
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
	Cleaning must be done to make sure database will not be filled with old obsolete cache entries.
	But since CLEANING and FETCHING are both ASYNCHRONOUS operations, make sure that entry is really 
	OBSOLETE => Use for example 10 minutes.
*/
const Proxe_Clean = (res) => {
	Proxe.find()
		.exec()
		.then(docs=>{
			console.log(['Proxe has now ',docs.length,' entries.']);
			const trash = [];
			docs.forEach(doc => {
				// DO NOT PROCESS the one given as parameter.
				/*if (doc.hash  === hash) {
					// Exclude this URL.
				} else {
				*/
				const upd = doc.updated; // Date object
				const exp_ms = 600*1000; // Cleaning time in milliseconds (10 minutes).
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
	
	const expiration = req.body.expiration_in_seconds;
	
	//Proxe_Clean(); // We must exclude requested url from the cleaning process.
	
	// First check if this url is already in database.
	Proxe.find({url:url})
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
					//console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					//console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTPS_Fetch({url:url, id:proxe[0]._id, options:{}, response_type:'xml'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				//console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTPS_Fetch({url:url, expiration:expiration, options:{}, response_type:'xml'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

/*

Russia
data are available from https://br.so-ups.ru
No need for api key, web request is enough
date time format = 'yyyy.MM.dd'
url = 'http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1&startDate='<Start date time>'&endDate='<End date time> ;
routine in MatLab is available in section 5.4.2
the technology retrieved from br are:

P_AES nuclear power
P_GES hydropower
P_TES CHP units
P_BS stock (mainly pulp and paper factories)
P_REN solar

http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1&startDate=2021.06.04&endDate=2021.06.04
RESPONSE:
[
  {
    "$id": "1",
    "m_Item1": 1,
    "m_Item2": [
      {
        "INTERVAL": 0,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22519.451171875,
        "P_GES": 9818.150390625,
        "P_TES": 34141.2421875,
        "P_BS": 6375.35205078125,
        "P_REN": 0
      },
      ...
      {
        "INTERVAL": 23,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22870,
        "P_GES": 11249.2998046875,
        "P_TES": 36445.94921875,
        "P_BS": 6572.93115234375,
        "P_REN": 0
      }
    ]
  }
]
*/
router.post('/russia', (req,res,next)=>{
	// req.body.url
	// req.body.start_date
	// req.body.end_date
	// req.body.expiration_in_seconds;
	let url = req.body.url + '&startDate=' + req.body.start_date + '&endDate=' + req.body.end_date;
	//console.log(['url=',url]);
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const expiration = req.body.expiration_in_seconds;
	
	console.log(['russia url=',url]);
	
	//Proxe_Clean(); // We must exclude requested url from the cleaning process.
	
	// First check if this url is already in database.
	Proxe.find({url:url})
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
					//console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					//console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTP_Fetch({url:url, id:proxe[0]._id, options:options, response_type:'json'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				//console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTP_Fetch({url:url, expiration:expiration, options:options, response_type:'json'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});
/*
Sweden
data are available from https://www.svk.se/om-kraftsystemet/kontrollrummet/
No need for api key, web request is enough
date time format = 'yyyy-MM-dd'
url = 'https://www.svk.se/ControlRoom/GetProductionHistory/?productionDate=' <Date time>'&countryCode=SE'] ;
routine in MatLab is available in section 5.4.1
As the return json file is for an entire day, one must retrieve the last entry for each field to return the right amount of energy per technology
the technology retrieved from svk are:
{'production', ...
'nuclear', ...
'thermal', ...
'unknown', ...
'wind', ...
'hydro', ...
'consumption'} ;

https://www.svk.se/ControlRoom/GetProductionHistory/?productionDate=2021-06-04&countryCode=SE

one sample per 60 seconds
one full day = 60 x 24 = 1440 samples
extract the last one:
"name" = 1 (2,3,4,5,6,7)

Powerindex = {'production', ... 'nuclear', ... 'hydro', ... 'thermal', ... 'wind', ... 'unknown', ... 'consumption'} ;


data [] last item. {x = unix timestamp in ms, y = value) 

[
  {
    "name": 1,
    "sortorder": 1,
    "data": [
      {
        "x": 1590271260000,
        "y": 14343
      },
      {
        "x": 1590357480000,
        "y": 12015
      }
    ]
  }
]
*/
router.post('/sweden', (req,res,next)=>{
	// req.body.url					https://www.svk.se/ControlRoom/GetProductionHistory/
	// req.body.production_date		YYYY-MM-DD
	let url = req.body.url + '?productionDate=' + req.body.production_date + '&countryCode=SE';
	//console.log(['url=',url]);
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	console.log(['sweden url=',url]);
	const expiration = req.body.expiration_in_seconds;
	// First check if this url is already in database.
	Proxe.find({url:url})
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
					//console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					//console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTPS_Fetch({url:url, id:proxe[0]._id, options:options, response_type:'json'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				//console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTPS_Fetch({url:url, expiration:expiration, options:options, response_type:'json'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

router.post('/fingrid', (req,res,next)=>{
	// req.body.url
	// req.body.expiration_in_seconds
	const url = req.body.url;
	console.log(['fingrid url=',url]);
	const options = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': process.env.FINGRID_API_KEY
		}
	};
	const expiration = req.body.expiration_in_seconds;
	// First check if this url is already in database.
	Proxe.find({url:url})
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
					//console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					//console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTPS_Fetch({url:url, id:proxe[0]._id, options:options, response_type:'json'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				//console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTPS_Fetch({url:url, expiration:expiration, options:options, response_type:'json'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

router.post('/empo', (req,res,next)=>{
	// req.body.url
	// req.body.expiration_in_seconds;
	const url = 'http://128.214.253.150/api/v1/resources/' + req.body.url;
	//console.log(['url=',url]);
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const expiration = req.body.expiration_in_seconds;
	
	//console.log(['empo url=',url]);
	
	//Proxe_Clean(); // We must exclude requested url from the cleaning process.
	
	// First check if this url is already in database.
	Proxe.find({url:url})
		.exec()
		.then(proxe=>{
			if (proxe.length >= 1) {
				// FOUND! Check if it is expired.
				const upd = proxe[0].updated; // Date object
				const exp_ms = proxe[0].expiration*1000; // expiration time in milliseconds
				const now = new Date();
				const elapsed = now.getTime() - upd.getTime(); // elapsed time in milliseconds
				console.log(['elapsed=',elapsed,' exp_ms=',exp_ms]);
				if (elapsed < exp_ms) {
					// Use CACHED version of RESPONSE
					console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTP_Fetch({url:url, id:proxe[0]._id, options:options, response_type:'json'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTP_Fetch({url:url, expiration:expiration, options:options, response_type:'json'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

router.get('/clean', (req,res,next)=>{
	Proxe_Clean(res);
});

router.post('/sivakkastatus', (req,res,next)=>{
	// req.body.url
	// req.body.expiration_in_seconds
	let url = req.body.url;
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	console.log(['sivakkastatus url=',url]);
	const expiration = req.body.expiration_in_seconds;
	// First check if this url is already in database.
	Proxe.find({url:url})
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
					//console.log('NOT expired => USE Cached response!');
					res.status(200).json(proxe[0].response);
				} else {
					//console.log('Expired => FETCH a FRESH copy!');
					// FETCH a FRESH copy from SOURCE and Update existing Proxe Entry
					Proxe_HTTPS_Fetch({url:url, id:proxe[0]._id, options:options, response_type:'json'}, res);
				}
			} else {
				// Not cached yet => FETCH a FRESH copy from SOURCE and SAVE it as a new Entry.
				//console.log(['Not cached yet => FETCH a FRESH copy! url=',url]);
				Proxe_HTTPS_Fetch({url:url, expiration:expiration, options:options, response_type:'json'}, res);
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

module.exports = router;
