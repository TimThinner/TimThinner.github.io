const express = require('express');
const router = express.Router();

//const checkAuth = require('../middleware/check-auth');
const Configuration = require('../models/configuration');
/*
	Get all configurations (there is now only one).
*/
router.get('/', (req,res,next)=>{
	Configuration.find()
		.select('_id signup version')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				configurations: docs.map(doc=>{
					return {
						_id: doc._id,
						signup: doc.signup,
						version: doc.version
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

module.exports = router;
