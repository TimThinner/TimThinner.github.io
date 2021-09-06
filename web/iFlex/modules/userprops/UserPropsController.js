import Controller from '../common/Controller.js';
import UserPropsModel from  './UserPropsModel.js';
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
		
		
		Object.keys(this.models).forEach(key => {
			if (key === 'UserPropsModel') {
				this.master.modelRepo.remove(key);
			}
		});
		
		
		this.models = {};
	}
	
	initialize() {
		/*
		const model = new UserPropsModel({name:'UserPropsModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('UserPropsModel',model);
		this.models['UserPropsModel'] = model;
		*/
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPropsView(this);
	}
	
	clean() {
		console.log('UserPropsController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		//this.timers['UserPropsView'] = {timer: undefined, interval: -1, models:['UserPropsModel']};
		//this.timers['UserPropsView'] = {timer: undefined, interval: 30000, models:['UserPropsModel']};
	}
}
