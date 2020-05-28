import Controller from '../common/Controller.js';
import UserElectricityModel from  '../userelectricity/UserElectricityModel.js';
import UserElectricityChartsView from './UserElectricityChartsView.js';

export default class UserElectricityChartsController extends Controller {
	
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
		/*
		Object.keys(this.models).forEach(key => {
			if (key === 'UserElectricityModel') {
				this.master.modelRepo.remove(key);
			}
		});
		*/
	}
	
	init() {
		this.models['UserElectricityModel'] = this.master.modelRepo.get('UserElectricityModel');
		this.models['UserElectricityModel'].subscribe(this);
		
		this.timers['UserElectricityView'] = {timer: undefined, interval: 30000, models:['UserElectricityModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityChartsView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}