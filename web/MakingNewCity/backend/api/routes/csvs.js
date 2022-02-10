const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');

const csv = require('csv-parser');
const fs = require('fs');


router.get('/:filename',(req,res,next)=>{
	const fn = './data/'+req.params.filename;
	/*
		To specify options for csv, pass an object argument to the function. For example:
		csv({ separator: '\t' });
	*/
	const results = [];
	fs.createReadStream(fn)
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => {
			//console.log(results);
			res.status(200).json(results);
		});
});

module.exports = router;
