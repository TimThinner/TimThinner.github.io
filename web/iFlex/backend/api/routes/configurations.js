const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const Configuration = require('../models/configuration');
/*
	Get all configurations (there is now only one).
	
	Configuration has only these properties:
	
	_id: mongoose.Schema.Types.ObjectId,
	signup: { type: Boolean, default: false },
	version: { type:String }
	
	
	
*/
router.get('/', (req,res,next)=>{
	Configuration.find()
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				configurations: docs.map(doc=>{
					return doc
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});

router.put('/:configId', checkAuth, (req,res,next)=>{
	const id = req.params.configId;
	const updateOps = {};
	let filled = false;
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
		filled = true;
	}
	if (filled) {
		Configuration.updateOne({_id:id},{$set: updateOps})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Configuration updated'
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
