const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Alarm = require('../models/alarm');
/*
	Get all alarms for current user.
*/
router.get('/', checkAuth, (req,res,next)=>{
	
	Alarm.find({userId:req.userData['userId']}) // Current User
		.select('_id userId alarmType alarmTimestamp created severity acknowledged')
		//.populate('userId')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				alarms: docs.map(doc=>{
					return {
						_id: doc._id,
						userId: doc.userId,
						alarmType: doc.alarmType,
						alarmTimestamp: doc.alarmTimestamp,
						created: doc.created,
						severity: doc.severity,
						acknowledged: doc.acknowledged
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
	req.body.refToUser
	req.body.alarmType
	req.body.alarmTimestamp
	req.body.severity
*/
router.post("/", checkAuth, (req,res,next)=>{
	const uid = req.body.refToUser;
	const aType = req.body.alarmType;
	const aTs = req.body.alarmTimestamp;
	const s = req.body.severity;
	// First check that this alarm is NOT already in the database.
	Alarm.find({userId:uid, alarmType:aType, alarmTimestamp:aTs})
		.exec()
		.then(alarm=>{
			if (alarm.length >= 1) {
				// CONFLICT!
				return res.status(409).json({
					message: 'This alarm already exists'
				});
			} else {
				// NO CONFLICT!
				const ala = new Alarm({
					_id: new mongoose.Types.ObjectId(),
					userId: uid,
					alarmType: aType,
					alarmTimestamp: aTs,
					severity: s
				});
				ala
					.save()
					.then(result=>{
						const msg = 'Alarm Created OK';
						res.status(201).json({message:msg});
					})
					.catch(err=>{
						console.log(err);
						res.status(500).json({error:err});
					});
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

/*
	Update a specified alarm information.
	https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
	
	For example:
	const data = [
		{propName:'severity', value:severity},
		{propName:'acknowledged', value:acknowledged}
	];
*/
router.put('/:alarmId', checkAuth, (req,res,next)=>{
	const id = req.params.alarmId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Alarm.updateOne({_id:id},{$set: updateOps})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Alarm updated'
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});

router.delete('/:alarmId', checkAuth, (req,res,next)=>{
	const id = req.params.alarmId; // NOTE: id is a string!
	Alarm.findById(id)
		.select('_id userId alarmType alarmTimestamp created severity acknowledged')
		.exec()
		.then(doc=>{
			if (doc) {
				Alarm.deleteOne({_id:id})
					.exec()
					.then(result => {
						res.status(200).json({message: 'Alarm deleted'});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({error:err});
					});
			
			} else {
				res.status(404).json({message:'Alarm not found'});
			}
		})
		.catch(err=>{
			res.status(500).json({error:err});
		});
	
});

module.exports = router;
