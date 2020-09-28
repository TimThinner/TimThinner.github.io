const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const Regcode = require('../models/regcode');
const Readkey = require('../models/readkey');
/*
	Get all bindings.
*/
router.get('/', checkAuth, (req,res,next)=>{
	User.find()
		.select('_id email created regcode readkey')
		.populate('regcode')
		.populate('readkey')
		.exec()
		.then(docs=>{
			const ba = docs.map(doc=>{
				return {
					//email: doc.email,
					apartmentId: doc.regcode?doc.regcode.apartmentId:'-',
					readkey: doc.readkey?doc.readkey._id:'-'
				}
			});
			// Return ONLY those bindings that HAVE apartmentId and readkey!
			const baa = ba.filter(b => b.apartmentId !== '-');
			res.status(200).json({
				bindings: baa
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

module.exports = router;
