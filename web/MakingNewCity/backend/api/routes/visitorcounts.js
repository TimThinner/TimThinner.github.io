const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Visitorcount = require('../models/visitorcount');

router.get('/', (req,res,next)=>{
	Visitorcount.find()
		.select('_id created')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length
				/*list: docs.map(doc=>{
					return {
						_id: doc._id,
						created: doc.created
					}
				})*/
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

/*
router.get('/', (req,res,next)=>{
	Visitorcount.find()
		.select('_id count')
		.exec()
		.then(vc=>{
			if (vc.length < 1) {
				res.status(404).json({
					message: 'Visitorcount not found',
					count: 0
				});
			} else {
				res.status(200).json({
					message: 'OK',
					count: vc[0].count
				});
			}
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});
*/

router.post("/", (req,res,next)=>{
	
	const vc = new Visitorcount({
		_id: new mongoose.Types.ObjectId()
	});
	vc.save()
		.then(result=>{
			const msg = 'OK';
			res.status(200).json({message:msg});
		})
		.catch(err=>{
			if (typeof err.message !== 'undefined') {
				console.log(err.message);
			}
			res.status(500).json({error:err});
		});
});

/*
router.post("/", (req,res,next)=>{
	Visitorcount.find()
		.select('_id count')
		.exec()
		.then(vc=>{
			if (vc.length < 1) {
				// Does not exist yet => create it.
				const vcount = new Visitorcount({
					_id: new mongoose.Types.ObjectId(),
					count: 0
				});
				vcount.save()
					.then(result=>{
						const msg = 'Visitor count CREATED!';
						//console.log(msg);
						res.status(200).json({message:msg});
					})
					.catch(err=>{
						const msg = 'Visitor count error!';
						console.log(msg);
						res.status(500).json({error:err});
					});
			} else {
				// Increment counter and save.
				let new_count = vc[0].count;
				new_count++;
				//console.log(new_count);
				const updateOps = {'count':new_count};
				Visitorcount.updateOne({_id:vc[0]._id},{$set: updateOps})
					.exec()
					.then(result => {
						res.status(200).json({
							message: 'Visitor count incremented'
						});
					})
					.catch(err=>{
						console.log(err);
						res.status(500).json({error:err});
					});
			}
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});
*/

module.exports = router;
