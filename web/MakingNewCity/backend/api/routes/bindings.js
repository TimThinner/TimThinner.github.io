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
					readkey: doc.readkey?doc.readkey._id:'-',
					readkey_startdate: doc.readkey?doc.readkey.startdate:'-',
					readkey_enddate: doc.readkey?doc.readkey.enddate:'-'
				}
			});
			// Return ONLY those bindings that
			//    - HAVE a readkey (and apartmentId)
			//    - HAVE a valid readkey (now is between startdate and enddate)
			//    
			const baa = ba.filter(b => b.readkey !== '-');
			const resu = [];
			const ts = Date.now();
			baa.forEach(b=>{
				const sTS = new Date(b.readkey_startdate);
				const eTS = new Date(b.readkey_enddate);
				if (ts > sTS.getTime() && ts < eTS.getTime()) {
					const n = {apartmentId:b.apartmentId, readkey:b.readkey};
					resu.push(n);
				}
			});
			res.status(200).json({
				bindings: resu
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

module.exports = router;
