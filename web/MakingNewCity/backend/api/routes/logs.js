const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Log = require('../models/log');
/*
	Get all logs.
*/
router.get('/', checkAuth, (req,res,next)=>{
	Log.find()
		.select('_id userId eventType created')
		.populate('userId')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				logs: docs.map(doc=>{
					return {
						_id: doc._id,
						userId: doc.userId,
						eventType: doc.eventType,
						created: doc.created
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

/*
	PARAMETERS:
	req.body.refToUser:
	req.body.eventType: 'Logout'
	
	NOTE: 'Login' is now submitted directly from "users/login" route. No need to POST via this API.
*/
router.post("/", checkAuth, (req,res,next)=>{
	
	const refToUser = req.body.refToUser;
	const et = req.body.eventType;
	
	const logEntry = new Log({
		_id: new mongoose.Types.ObjectId(),
		userId: refToUser,
		eventType: et
	});
	logEntry
		.save()
		.then(result=>{
			const msg = et+' logged';
			res.status(200).json({message:msg});
		})
		.catch(err=>{
			const msg = et+' NOT logged';
			console.log(msg);
			res.status(500).json({error:err});
		});
});

module.exports = router;
