const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Readkey = require('../models/readkey');
/*
	_id: mongoose.Schema.Types.ObjectId,
	startdate: { type:Date, default: Date.now },
	enddate:   { type:Date, default: Date.now }
*/
/*
	Get all readkeys.
*/
router.get('/', checkAuth, (req,res,next)=>{
	Readkey.find()
		.select('_id startdate enddate')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				readkeys: docs.map(doc=>{
					return {
						_id: doc._id,
						startdate: doc.startdate,
						enddate: doc.enddate
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});
/*
	Update a specified readkey.
	https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
*/
/*
	Update a specified readkey information.
	https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
	const data = [
		{propName:'startdate', value:startdate},
		{propName:'enddate', value:enddate}
	];
*/
router.put('/:readkeyId', checkAuth, (req,res,next)=>{
	const id = req.params.readkeyId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Readkey.updateOne({_id:id},{$set: updateOps})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Readkey updated'
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});

router.delete('/:readkeyId', checkAuth, (req,res,next)=>{
	
	const id = req.params.readkeyId; // NOTE: id is a string!
	
	Readkey.findById(id)
		.select('_id startdate enddate')
		.exec()
		.then(doc=>{
			if (doc) {
				Readkey.deleteOne({_id:id})
					.exec()
					.then(result => {
						res.status(200).json({message: 'Readkey deleted'});
					})
					.catch(err => {	
						console.log(err);
						res.status(500).json({error:err});
					});
			
			} else {
				res.status(404).json({message:'Readkey not found'});
			}
		})
		.catch(err=>{
			res.status(500).json({error:err});
		});
	
});

module.exports = router;
