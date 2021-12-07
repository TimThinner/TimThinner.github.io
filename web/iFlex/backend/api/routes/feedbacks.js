const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Feedback = require('../models/feedback');
/*
	Get all feedback for current user.
*/
router.get('/', checkAuth, (req,res,next)=>{
	
	Feedback.find({_id:req.userData['userId']}) // Current User
		.select('_id userId feedbackType created feedback feedbackText')
		//.populate('userId')
		.exec()
		.then(docs=>{
			res.status(200).json({
				count: docs.length,
				feedbacks: docs.map(doc=>{
					return {
						_id: doc._id,
						userId: doc.userId,
						feedbackType: doc.feedbackType,
						created: doc.created,
						feedback: doc.feedback,
						feedbackText: doc.feedbackText
					}
				})
			});
		})
		.catch(err=>{
			res.status(500).json({error: err});
		});
});
/*
	PARAMETERS:
	req.body.refToUser
	req.body.feedbackType
	req.body.feedback
	req.body.feedbackText
*/
//router.post("/", checkAuth, (req,res,next)=>{
router.post("/", (req,res,next)=>{
	
	const refToUser = req.body.refToUser;
	const fbType = req.body.feedbackType;
	const fbCreated = req.body.feedbackCreated;
	const fb = req.body.feedback;
	const fbText = req.body.feedbackText;
	
	const entry = new Feedback({
		_id: new mongoose.Types.ObjectId(),
		userId: refToUser,
		feedbackType: fbType,
		created: fbCreated,
		feedback: fb,
		feedbackText: fbText
	});
	entry
		.save()
		.then(result=>{
			const msg = 'Feedback submitted OK';
			res.status(200).json({message:msg});
		})
		.catch(err=>{
			const msg = 'Feedback ERROR';
			console.log(msg);
			res.status(500).json({error:err});
		});
});

module.exports = router;
