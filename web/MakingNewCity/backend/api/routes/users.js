const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
//const Log = require('../models/log');
const Regcode = require('../models/regcode');
const Readkey = require('../models/readkey');
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
	regcode:  { type: mongoose.Schema.Types.ObjectId, ref:'Regcode'},
	readkey:  { type: mongoose.Schema.Types.ObjectId, ref:'Readkey'},
	
	price_energy_monthly: {type:Number, default:0},
	price_energy_basic: {type:Number, default:0},
	price_energy_transfer: {type:Number, default:0},
	
	point_id_a: {type:String, default:''},
	point_id_b: {type:String, default:''},
	point_id_c: {type:String, default:''},
	
	heating_temperature_upper: {type:Number, default:0},
	heating_target_temperature: {type:Number, default:0},
	heating_temperature_lower: {type:Number, default:0},
	heating_humidity_upper: {type:Number, default:0},
	heating_target_humidity: {type:Number, default:0},
	heating_humidity_lower: {type:Number, default:0},
	water_hot_upper: {type:Number, default:0},
	water_hot_target: {type:Number, default:0},
	water_hot_lower: {type:Number, default:0},
	water_cold_upper: {type:Number, default:0},
	water_cold_target: {type:Number, default:0},
	water_cold_lower: {type:Number, default:0},
	energy_upper: {type:Number, default:0},
	energy_target: {type:Number, default:0},
	energy_lower: {type:Number, default:0},
	is_superuser: { type: Boolean, default: false }
*/

/*
	Get all users.
*/
router.get('/', checkAuth, (req,res,next)=>{
	User.find()
		.select('_id email created regcode readkey point_id_a point_id_b point_id_c request_for_tablet consent_a consent_b')
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
						readkey: doc.readkey,
						point_id_a: doc.point_id_a,
						point_id_b: doc.point_id_b,
						point_id_c: doc.point_id_c,
						request_for_tablet: doc.request_for_tablet,
						consent_a: doc.consent_a,
						consent_b: doc.consent_b
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

/*
	When user signs up:
	- check that email is not already used
		- find given regcode
			- check from regcode that 
				- emails match
				- current timestamp is between startdate and enddate
					- create a readkey and save it
					- NOTE: readkey is set to have same startdate and enddate as regcode
					
	
	=> assign Ref to that RegCode
	
		=> assign Ref to that ReadKey.
	
	That's it!
*/
router.post("/signup", (req,res,next)=>{
	const email_lc = req.body.email.toLowerCase();
	const regcode_lc = req.body.regcode.toLowerCase();
	const request_for_tablet = req.body.request_for_tablet;
	const consent_a = req.body.consent_a;
	const consent_b = req.body.consent_b;
	
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
				// Normal case: find the given REGCODE from database:
				Regcode.find({code:regcode_lc})
					.exec()
					.then(regcode=>{
						//console.log(['regcode=',regcode]);
						if (regcode && regcode.length > 0) {
							//console.log(['regcode[0]=',regcode[0]]);
							// Ref to regcode is regcode[0]._id;
							// Check that emails match
							if (regcode[0].email === email_lc) {
								// Check that current timestamp is between startdate and enddate
								const ts = Date.now()+120000; // Add extra 2 minutes if server clocks are not in sync.
								const sTS = new Date(regcode[0].startdate);
								const eTS  = new Date(regcode[0].enddate);
								//console.log(['Now=',ts]);
								//console.log(['Start=',sTS.getTime()]);
								//console.log(['End=',eTS.getTime()]);
								if (ts > sTS.getTime() && ts < eTS.getTime()) {
									// Generate a ReadKey and save it
									const readkey = new Readkey({
										_id: new mongoose.Types.ObjectId(),
										startdate: sTS,
										enddate: eTS
									});
									readkey
										.save()
										.then(result=>{
											//console.log(['Readkey saved result=',result]);
											// Generate a User and save it
											bcrypt.hash(req.body.password, 10, (err,hash)=>{
											if (err) {
												return res.status(500).json({error:err});
											} else {
												let point_id_a = ''; // Heating
												let point_id_b = ''; // Electricity
												let point_id_c = ''; // Water
												if (email_lc === 'testa@test.fi' || email_lc === 'testb@test.fi' ||
													email_lc === 'testc@test.fi' || email_lc === 'testd@test.fi' ||
													email_lc === 'teste@test.fi' || email_lc === 'testf@test.fi') {
													// Assign dummy point id values to Heating and Electricity
													point_id_a = '123';
													point_id_b = '456';
												}
												const user = new User({
													_id: new mongoose.Types.ObjectId(),
													email: email_lc, // Store lowercase version of email.
													password: hash,
													regcode: regcode[0]._id, // Ref to Regcode
													readkey: result._id, // Ref to Readkey
													request_for_tablet: request_for_tablet,
													consent_a: consent_a,
													consent_b: consent_b,
													point_id_a: point_id_a,
													point_id_b: point_id_b,
													point_id_c: point_id_c
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
										})
										.catch(err=>{
											console.log(['err=',err]);
											res.status(500).json({error:err});
										})
								} else {
									res.status(404).json({message: 'Regcode Expired'});
								}
							} else {
								res.status(404).json({message: 'Email and Regcode Not Matching'});
							}
						} else {
							res.status(404).json({message: 'Regcode Not Found'});
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
	
	const email_lc = req.body.email.toLowerCase();
	const selString = '_id email password created regcode readkey'+
		' price_energy_monthly price_energy_basic price_energy_transfer'+
		' point_id_a point_id_b point_id_c'+
		' request_for_tablet consent_a consent_b'+
		' heating_temperature_upper heating_target_temperature heating_temperature_lower'+
		' heating_humidity_upper heating_target_humidity heating_humidity_lower'+
		' water_hot_upper water_hot_target water_hot_lower'+
		' water_cold_upper water_cold_target water_cold_lower'+
		' energy_upper energy_target energy_lower'+
		' is_superuser';
	User.find({email:email_lc})
		.select(selString)
		.populate('regcode')
		.populate('readkey')
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
							expiresIn: "365 days"
						}
					)
					const rkey = user[0].readkey ? user[0].readkey._id : undefined;
					const rkey_startdate = user[0].readkey ? user[0].readkey.startdate : undefined;
					const rkey_enddate = user[0].readkey ? user[0].readkey.enddate : undefined;
					
					const apaid = user[0].regcode ? user[0].regcode.apartmentId : undefined;
					
					const pem = user[0].price_energy_monthly ? user[0].price_energy_monthly : undefined;
					const peb = user[0].price_energy_basic ? user[0].price_energy_basic : undefined;
					const pet = user[0].price_energy_transfer ? user[0].price_energy_transfer : undefined;
					
					const pid_a = user[0].point_id_a ? user[0].point_id_a : undefined;
					const pid_b = user[0].point_id_b ? user[0].point_id_b : undefined;
					const pid_c = user[0].point_id_c ? user[0].point_id_c : undefined;
					
					const htu = user[0].heating_temperature_upper ? user[0].heating_temperature_upper : undefined;
					const htt = user[0].heating_target_temperature ? user[0].heating_target_temperature : undefined;
					const htl = user[0].heating_temperature_lower ? user[0].heating_temperature_lower : undefined;
					const hhu = user[0].heating_humidity_upper ? user[0].heating_humidity_upper : undefined;
					const hth = user[0].heating_target_humidity ? user[0].heating_target_humidity : undefined;
					const hhl = user[0].heating_humidity_lower ? user[0].heating_humidity_lower : undefined;
					
					const whu = user[0].water_hot_upper ? user[0].water_hot_upper : undefined;
					const wht = user[0].water_hot_target ? user[0].water_hot_target : undefined;
					const whl = user[0].water_hot_lower ? user[0].water_hot_lower : undefined;
					
					const wcu = user[0].water_cold_upper ? user[0].water_cold_upper : undefined;
					const wct = user[0].water_cold_target ? user[0].water_cold_target : undefined;
					const wcl = user[0].water_cold_lower ? user[0].water_cold_lower : undefined;
					
					const eu = user[0].energy_upper ? user[0].energy_upper : undefined;
					const et = user[0].energy_target ? user[0].energy_target : undefined;
					const el = user[0].energy_lower ? user[0].energy_lower : undefined;
					
					// LOG this login.
					/*
					const logEntry = new Log({
						_id: new mongoose.Types.ObjectId(),
						userId: user[0]._id, // Ref to User
						eventType: 'Login'
					});
					logEntry
						.save()
						.then(result=>{
							console.log('LOG Login saved!');
						})
						.catch(err=>{
							console.log(['LOG Login err=',err]);
						});
					*/
					return res.status(200).json({
						message: 'Auth successful',
						token: token,
						userId: user[0]._id,
						created: user[0].created,
						apartmentId: apaid,
						readkey: rkey,
						readkey_startdate: rkey_startdate,
						readkey_enddate: rkey_enddate,
						price_energy_monthly: pem,
						price_energy_basic: peb,
						price_energy_transfer: pet,
						point_id_a: pid_a,
						point_id_b: pid_b,
						point_id_c: pid_c,
						request_for_tablet: user[0].request_for_tablet,
						consent_a: user[0].consent_a,
						consent_b: user[0].consent_b,
						heating_temperature_upper: htu,
						heating_target_temperature: htt,
						heating_temperature_lower: htl,
						heating_humidity_upper: hhu,
						heating_target_humidity: hth,
						heating_humidity_lower: hhl,
						water_hot_upper: whu,
						water_hot_target: wht,
						water_hot_lower: whl,
						water_cold_upper: wcu,
						water_cold_target: wct,
						water_cold_lower: wcl,
						energy_upper: eu,
						energy_target: et,
						energy_lower: el,
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

/*
	Get pointids for current user.
*/
router.post('/pointids', checkAuth, (req,res,next)=>{
	User.find({_id:req.userData['userId']}) // Current User
		.select('point_id_a point_id_b point_id_c')
		.exec()
		.then(user=>{
			if (user.length < 1) {
				return res.status(404).json({message: 'Not Found'});
			}
			const point_id_a = user[0].point_id_a ? user[0].point_id_a : '';
			const point_id_b = user[0].point_id_b ? user[0].point_id_b : '';
			const point_id_c = user[0].point_id_c ? user[0].point_id_c : '';
			res.status(200).json({
				message:'OK',
				point_id_a: point_id_a,
				point_id_b: point_id_b,
				point_id_c: point_id_c
			});
		})
		.catch(err => {
			res.status(500).json({error:err});
		});
});

/*
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
*/
router.post("/changepsw", checkAuth, (req,res,next)=>{
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
/*
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
});*/


/*
	Update a specified User information.
	https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
	
	price_energy_monthly: {type:Number, default:0},
	price_energy_basic: {type:Number, default:0},
	price_energy_transfer: {type:Number, default:0},
	
	point_id_a: {type:String, default:''},
	point_id_b: {type:String, default:''},
	point_id_c: {type:String, default:''},
	
	heating_temperature_upper: {type:Number, default:0},
	heating_target_temperature: {type:Number, default:0},
	heating_temperature_lower: {type:Number, default:0},
	heating_humidity_upper: {type:Number, default:0},
	heating_target_humidity: {type:Number, default:0},
	heating_humidity_lower: {type:Number, default:0},
	water_hot_upper: {type:Number, default:0},
	water_hot_target: {type:Number, default:0},
	water_hot_lower: {type:Number, default:0},
	water_cold_upper: {type:Number, default:0},
	water_cold_target: {type:Number, default:0},
	water_cold_lower: {type:Number, default:0},
	energy_upper: {type:Number, default:0},
	energy_target: {type:Number, default:0},
	energy_lower: {type:Number, default:0},
	
	For example:
	const data = [
		{propName:'price_energy_monthly', value:6.0},
		{propName:'price_energy_basic', value:4.6},
		{propName:'price_energy_transfer', value:3.1}
	];
	
*/
router.put('/:userId', checkAuth, (req,res,next)=>{
	const id = req.params.userId;
	const updateOps = {};
	let filled = false;
	for (const ops of req.body) {
		// Allow only "price_" OR "heating_" changes!
		if (ops.propName.indexOf('price_') === 0 || 
			ops.propName.indexOf('heating_') === 0 || 
			ops.propName.indexOf('water_') === 0 || 
			ops.propName.indexOf('energy_') === 0 || 
			ops.propName.indexOf('point_id') === 0) {
			
			updateOps[ops.propName] = ops.value;
			filled = true;
		}
	}
	if (filled) {
		User.updateOne({_id:id},{$set: updateOps})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'User updated'
				});
			})
			.catch(err=>{
				console.log(err);
				res.status(500).json({error:err});
			});
	} else {
		res.status(404).json({
			message: 'Nothing to update'
		});
	}
});

module.exports = router;
