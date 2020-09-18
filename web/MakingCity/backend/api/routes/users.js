const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

/*
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type:String,
		required:true,
		unique:true,
		// => DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {type:String, required:true},
	created: { type: Date, default: Date.now },
	regcode:  { type: mongoose.Schema.Types.ObjectId, ref:'Regcode', required:true},
	readkey:  { type: mongoose.Schema.Types.ObjectId, ref:'Readkey', required:true},
	is_superuser: { type: Boolean, default: false }
*/

/*
	Get all users.
*/
router.get('/', checkAuth, (req,res,next)=>{
	User.find()
		.select('_id email created regcode readkey')
		.populate('regcode')
		.populate('readkey')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				users: docs.map(doc=>{
					return {
						_id: doc._id,
						email: doc.email,
						created: doc.created,
						regcode: doc.regcode,
						readkey: doc.readkey
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

router.post("/signup", (req,res,next)=>{
	const email_lc = req.body.email.toLowerCase();
	// First check that this email is NOT already used.
	User.find({email:email_lc})
		.exec()
		.then(user=>{
			if (user.length >= 1) {
				// CONFLICT!
				return res.status(409).json({
					message: 'This email already exists'
				});
			} else {
				// NO CONFLICT!
				bcrypt.hash(req.body.password, 10, (err,hash)=>{
					if (err) {
						return res.status(500).json({error:err});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: email_lc, // Store lowercase version of email.
							password: hash
						});
						user
							.save()
							.then(result=>{
								res.status(201).json({
									message:'User created'
								});
							})
							.catch(err=>{
								console.log(['err=',err]);
								res.status(500).json({error:err});
							})
					}
				})
			}
		})
		.catch(err=>{
			console.log(['err=',err]);
			res.status(500).json({error:err});
		});
});
/*
	Responses:
	200: {message:'Auth successful', token: ..., userId: ..., created: ...}
	401: {message: 'Auth failed'}
	500: error description from NodeJS
*/
router.post("/login", (req,res,next)=>{
	
	console.log(['req.body=',req.body]);
	
	const email_lc = req.body.email.toLowerCase();
	
	User.find({email:email_lc})
		.select('_id email password created is_superuser')
		.exec()
		.then(user=>{
			if (user.length < 1) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email:user[0].email,
							userId: user[0]._id
						},
						process.env.JWT_KEY,
						{
							// expiresIn: expressed in seconds or a string describing a time span zeit/ms.
							// Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. 
							// If you use a string be sure you provide the time units (days, hours, etc), 
							// otherwise milliseconds unit is used by default ("120" is equal to "120ms").
							expiresIn: "24h"
						}
					)
					return res.status(200).json({
						message: 'Auth successful',
						token: token,
						userId: user[0]._id,
						created: user[0].created,
						is_superuser: user[0].is_superuser
					});
				}
				return res.status(401).json({
					message: 'Auth failed'
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error:err});
		});
});

router.get("/verify", (req,res,next)=>{
	try {
		const token = req.headers.authorization.split(" ")[1]; // split "Bearer ggb78h4u3ih3r2b989yg"
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		//req.userData = decoded;
		return res.status(200).json({
			message: 'Auth successful'
		});
		
	} catch(error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
});

router.post("/changepassword", checkAuth, (req,res,next)=>{
	// After checkAuth the req.userData contains ['userId'] and ['email'] of CURRENT USER!
	// NOTE that this can be different user as in req.body.email, meaning that we allow 
	// super-users to change passwords for other users.
	const email_lc = req.body.email.toLowerCase();
	User.find({_id:req.userData['userId']}) // Current User
		.select('is_superuser')
		.exec()
		.then(cuser=>{
			if (cuser.length < 1) {
				return res.status(404).json({message: 'Not Found'});
			}
			if (cuser[0].is_superuser===true) {
				User.find({email:email_lc})
					.select('_id password')
					.exec()
					.then(user=>{
						if (user.length < 1) {
							return res.status(404).json({message: 'Not Found'});
						}
						bcrypt.hash(req.body.newpassword, 10, (err,hash)=>{
							if (err) {
								return res.status(500).json({error:err});
							} else {
								user[0].password = hash;
								user[0].save().then(result=>{
									return res.status(200).json({message: 'Password is now changed'});
								})
								.catch(err=>{
									console.log(['err=',err]);
									return res.status(500).json({error:err});
								})
							}
						});
					})
					.catch(err => {
						res.status(500).json({error:err});
					});
			} else {
				User.find({email:email_lc})
					.select('_id password')
					.exec()
					.then(user=>{
						if (user.length < 1) {
							return res.status(404).json({message: 'Not Found'});
						}
						bcrypt.compare(req.body.oldpassword, user[0].password, (err,result)=>{
							if (err) {
								return res.status(401).json({message: 'Auth failed'});
							}
							if (result) {
								bcrypt.hash(req.body.newpassword, 10, (err,hash)=>{
									if (err) {
										return res.status(500).json({error:err});
									} else {
										user[0].password = hash;
										user[0].save().then(result=>{
											return res.status(200).json({message: 'Password is now changed'});
										})
										.catch(err=>{
											console.log(['err=',err]);
											return res.status(500).json({error:err});
										})
									}
								});
							} else {
								return res.status(401).json({message: 'Auth failed'});
							}
						});
					})
					.catch(err => {
						res.status(500).json({error:err});
					});
			}
		})
		.catch(err => {
			res.status(500).json({error:err});
		});
});

/*
	Responses:
	200: {message:'User deleted'}
	500: error description from NodeJS
*/
router.delete("/:userId", checkAuth, (req,res,next)=>{
	const id = req.params.userId;
	User.remove({_id:id})
		.exec()
		.then(result => {
			res.status(200).json({message: 'User deleted'});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error:err});
		});
});

module.exports = router;
