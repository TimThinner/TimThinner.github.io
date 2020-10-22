const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Regcode = require('../models/regcode');
/*
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type:String,
		required:true,
		unique:true,
		// => DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	apartmentId: { type:String, required:true },
	code:        { type:String, required:true },
	startdate:   { type:Date, default: Date.now },
	enddate:     { type:Date, default: Date.now }
*/
/*
	Get all regcodes.
*/
router.get('/', checkAuth, (req,res,next)=>{
	Regcode.find()
		.select('_id email apartmentId code startdate enddate')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				regcodes: docs.map(doc=>{
					return {
						_id: doc._id,
						email: doc.email,
						apartmentId: doc.apartmentId,
						code: doc.code,
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
	Save a new regcode.
*/
router.post('/', checkAuth, (req,res,next)=>{
	const email_lc = req.body.email.toLowerCase();
	// First check that this email is NOT already used.
	Regcode.find({email:email_lc})
		.exec()
		.then(regcode=>{
			if (regcode.length >= 1) {
				// CONFLICT!
				return res.status(409).json({
					message: 'This email already exists'
				});
			} else {
				// NO CONFLICT!
				const code_lc = req.body.code.toLowerCase();
				const reg = new Regcode({
					_id: new mongoose.Types.ObjectId(),
					email: email_lc,
					apartmentId: req.body.apartmentId,
					code: code_lc,
					startdate: req.body.startdate,
					enddate: req.body.enddate
				});
				reg
					.save()
					.then(result=>{
						//console.log(result);
						res.status(201).json({
							message: 'Created regcode successfully',
							_id:         result._id,
							email:       result.email,
							apartmentId: result.apartmentId,
							code:        result.code,
							startdate:   result.startdate,
							enddate:     result.enddate
						});
					})
					.catch(err=>{
						console.log(err);
						res.status(500).json({error: err});
					})
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});

/*
	Update a specified regcode information.
	https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
	
	
	const data = [
		{propName:'startdate', value:startdate},
		{propName:'enddate', value:enddate}
	];
	
*/
router.put('/:regcodeId', checkAuth, (req,res,next)=>{
	const id = req.params.regcodeId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Regcode.updateOne({_id:id},{$set: updateOps})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Regcode updated'
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({error:err});
		});
});
/*
router.delete('/:regcodeId', checkAuth, (req,res,next)=>{
	
	const id = req.params.regcodeId; // NOTE: id is a string!
	
	Regcode.findById(id)
		.select('_id email apartmentId code startdate enddate')
		.exec()
		.then(doc=>{
			if (doc) {
				Regcode.deleteOne({_id:id})
					.exec()
					.then(result => {
						res.status(200).json({message: 'Regcode deleted'});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({error:err});
					});
			
			} else {
				res.status(404).json({message:'Regcode not found'});
			}
		})
		.catch(err=>{
			res.status(500).json({error:err});
		});
	
});
*/
module.exports = router;
