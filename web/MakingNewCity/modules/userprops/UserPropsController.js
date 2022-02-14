import Controller from '../common/Controller.js';
import UserPropsView from './UserPropsView.js';

export default class UserPropsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		// Object.keys(this.models).forEach(key => {
		// 	if (key === 'UserPropsModel') {
		// 		this.master.modelRepo.remove(key);
		// 	}
		// });
		this.models = {};
	}
	
	clean() {
		console.log('UserPropsController is now REALLY cleaned!');
		this.remove();
		this.init();
	}
	
	init() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPropsView(this);
	}
}
