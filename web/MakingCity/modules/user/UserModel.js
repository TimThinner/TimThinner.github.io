import Model from '../common/Model.js';
/*
	User has:
		
		email
		token
		
*/
export default class UserModel extends Model {
	constructor(options) {
		super(options);
		this.token = '';
	}
	
	signup() {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'signup',status:200,message:'Signup OK'}), 100);
	}
	
	login() {
		this.token = 'ededoiedoi';
		setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'Login OK'}), 100);
	}
	
	logout() {
		this.token = '';
		setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'Logout OK'}), 100);
	}
}
