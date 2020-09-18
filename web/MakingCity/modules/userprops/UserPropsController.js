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
	}
	
	clean() {
		console.log('UserPropsController is now REALLY cleaned!');
		this.remove();
		
		const model = new UserPropsModel({name:'UserPropsModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('UserPropsModel',model);
		this.models['UserPropsModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPropsView(this);
	}
	
	init() {
		const model = new UserPropsModel({name:'UserPropsModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('UserPropsModel',model);
		this.models['UserPropsModel'] = model;
		
		this.timers['UserPropsView'] = {timer: undefined, interval: -1, models:['UserPropsModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPropsView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
