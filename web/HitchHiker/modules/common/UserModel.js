import Model from './Model.js';
/*
*/
export default class UserModel extends Model {
	
	constructor(options) {
		// Model has:
		//this.name = options.name;
		//this.src = options.src;
		super(options);
		this.token = undefined;
	}
	
	isLoggedIn() {
		let retval = false;
		if (typeof this.token !== 'undefined') {
			retval = true;
		}
		return retval;
	}
}
