const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./api/routes/users');
const regcodesRoutes = require('./api/routes/regcodes');
const readkeysRoutes = require('./api/routes/readkeys');
const feedbackRoutes = require('./api/routes/feedbacks');
const proxeRoutes = require('./api/routes/proxes');
const configurationRoutes = require('./api/routes/configurations');

/*
mongoose.connect('mongodb://192.168.122.134:27017/iflex', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});*/
/*mongoose.connect('mongodb://127.0.0.1:27017/iflex', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
*/

async function run() {
    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    admin.buildInfo(function (err, info) {
       console.log(`mongodb: ${info.version}`);
       console.log(`mongoose: ${mongoose.version}`);
    });
}
mongoose.connect('mongodb://127.0.0.1:27017/iflex', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})
.then(() => {
	console.log('MongoDB connected');
	run();
})
.catch(error => {
	console.log(error);
});

// Before the routes add this to fix CORS errors.
// Actually browsers use this, not other tools (lke POSTMAN).
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header(
		'Access-Control-Allow-Headers', 
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	/*
	Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at
	(Reason: invalid token ‘GET POST OPTIONS PUT DELETE’ in CORS header ‘Access-Control-Allow-Methods’).
	
	 The header's value is a comma-delineated string of HTTP method names, 
	 such as GET, POST, or HEAD. 
	 If any of the specified values are not recognized by the client user agent, this error occurs.
	*/
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods','GET, POST, PATCH, OPTIONS, PUT, DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/users', usersRoutes);
app.use('/regcodes', regcodesRoutes);
app.use('/readkeys', readkeysRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/proxes', proxeRoutes);
app.use('/configurations', configurationRoutes);

// If we reach this line we have to report an error.
app.use((req,res,next)=>{
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

// This next code handles errors coming from any routes executing before it.
app.use((error,req,res,next)=>{
	res.status(error.status||500);
	res.json({error:{message:error.message}});
});

module.exports = app;
