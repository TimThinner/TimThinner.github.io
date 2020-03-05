
const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
	try {
		
		const token = req.headers.authorization.split(" ")[1]; // split "Bearer ggb78h4u3ih3r2b989yg"
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
		next();
		
	} catch(error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
};
