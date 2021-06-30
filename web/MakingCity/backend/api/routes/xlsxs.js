const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');

//const csv = require('csv-parser');
//const fs = require('fs');
const readXlsxFile = require('read-excel-file/node')

router.get('/:filename',(req,res,next)=>{
	const fn = './data/'+req.params.filename;
	
	// File path.
	
	
	readXlsxFile(fn, { sheet: 3 }).then((data) => {
		res.status(200).json(data);
	});
	/*
	readXlsxFile(fn).then((rows) => {
		// `rows` is an array of rows
		// each row being an array of cells.
		res.status(200).json(rows);
	})
	*/
	
	// Readable Stream.
	//	readXlsxFile(fs.createReadStream('/path/to/file')).then((rows) => {
	//	...
	//})
	
	
	
	/*
	
	const results = [];
	fs.createReadStream(fn)
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => {
			//console.log(results);
			res.status(200).json(results);
		});
		
	*/
});

module.exports = router;
