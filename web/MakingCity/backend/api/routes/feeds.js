const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var https = require('https'); // relay?

const Feed = require('../models/feed');

const checkAuth = require('../middleware/check-auth');
/*
router.get('/',(req,res,next)=>{
	Feed.find()
		.select('name route _id') // we don't need that "__v": 0
		.exec()
		.then(docs=>{
			const response = {
				count: docs.length,
				feeds: docs
			};
			res.status(200).json(response);
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});
*/

// https://makingcity.vtt.fi/data/arina/iss/feeds.json?calc=1&meterId=115&start=2020-02-28&end=2020-02-28

router.post('/', checkAuth, (req,res,next)=>{
	
	// process.env.HOST = "https://makingcity.vtt.fi"
	// req.body.url     = "/data/arina/iss/feeds.json?calc=1&meterId=115&start=2020-02-28&end=2020-02-28"
	//const url = process.env.HOST + req.body.url;
	const url = req.body.url;
	//const url = req.params.url;
	
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
});
/*
router.post('/',(req,res,next)=>{
	const feed = new Feed({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		route: req.body.route
	});
	feed
		.save()
		.then(result=>{
			res.status(201).json({
				message: 'Created feed successfully',
				createdFeed: {
					name: result.name,
					route: result.route
				}
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error: err});
		});
});

router.get('/:feedId',(req,res,next)=>{
	const id = req.params.feedId;
	Feed.findById(id)
		.select('name route _id') // we don't need that "__v": 0
		.exec()
		.then(doc=>{
			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({message:'Not found'});
			}
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});

router.patch('/:feedId',(req,res,next)=>{
	const id = req.params.feedId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Feed.update({_id:id},{$set:updateOps})
		.exec()
		.then(result=>{
			console.log(result);
			res.status(200).json(result);
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});

router.delete('/:feedId',(req,res,next)=>{
	const id = req.params.feedId;
	Feed.remove({_id:id})
		.exec()
		.then(result=>{
			res.status(200).json(result);
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});
*/
module.exports = router;