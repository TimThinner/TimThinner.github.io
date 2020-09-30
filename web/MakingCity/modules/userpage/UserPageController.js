import Controller from '../common/Controller.js';

import UserMeasurementModel from  './UserMeasurementModel.js';
import UserWaterModel from  '../userwater/UserWaterModel.js';
import UserHeatingModel from  '../userheating/UserHeatingModel.js';
import UserElectricityModel from  '../userelectricity/UserElectricityModel.js';

import UserPageView from './UserPageView.js';

export default class UserPageController extends Controller {
	
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
			if (key==='UserWaterModel'||key==='UserHeatingModel'||key==='UserElectricityModel'||key==='UserMeasurementModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		const model_1 = new UserWaterModel({name:'UserWaterModel',src:'to-be-added-in-the-future'});
		model_1.subscribe(this);
		this.master.modelRepo.add('UserWaterModel',model_1);
		this.models['UserWaterModel'] = model_1;
		
		const model_2 = new UserHeatingModel({name:'UserHeatingModel',src:'to-be-added-in-the-future'});
		model_2.subscribe(this);
		this.master.modelRepo.add('UserHeatingModel',model_2);
		this.models['UserHeatingModel'] = model_2;
		
		const model_3 = new UserElectricityModel({name:'UserElectricityModel',src:'to-be-added-in-the-future'});
		model_3.subscribe(this);
		this.master.modelRepo.add('UserElectricityModel',model_3);
		this.models['UserElectricityModel'] = model_3;
		
		const model_4 = new UserMeasurementModel({name:'UserMeasurementModel',src:'to-be-added-in-the-future'});
		model_4.subscribe(this);
		this.master.modelRepo.add('UserMeasurementModel',model_4);
		this.models['UserMeasurementModel'] = model_4;
		
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPageView(this);
	}
	
	clean() {
		console.log('UserPageController is now REALLY cleaned!');
		this.remove();
		/* IN PeriodicPoller:
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		*/
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserPageView'] = {timer: undefined, interval: 30000, models:['UserWaterModel','UserHeatingModel','UserElectricityModel','UserMeasurementModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
