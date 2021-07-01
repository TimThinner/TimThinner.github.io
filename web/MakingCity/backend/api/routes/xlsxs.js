const express = require('express');
const router = express.Router();
const readXlsxFile = require('read-excel-file/node')

router.get('/:filename',(req,res,next)=>{
	const fn = './data/'+req.params.filename;
	// File path.
	readXlsxFile(fn, { sheet: 3 }).then((data) => {
		res.status(200).json(data);
	});
});

module.exports = router;
