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
				const reg = new Regcode({
					_id: new mongoose.Types.ObjectId(),
					email: email_lc,
					apartmentId: req.body.apartmentId,
					code: req.body.code
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
module.exports = router;
