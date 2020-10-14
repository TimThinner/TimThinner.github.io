import Controller from '../common/Controller.js';

import { UserWaterNowModel, UserWaterDayModel, UserWaterWeekModel, UserWaterMonthModel } from  '../userwater/UserWaterModel.js';
import { UserHeatingNowModel, UserHeatingDayModel, UserHeatingWeekModel, UserHeatingMonthModel } from  '../userheating/UserHeatingModel.js';
import { UserElectricityNowModel, UserElectricityDayModel, UserElectricityWeekModel, UserElectricityMonthModel } from  '../userelectricity/UserElectricityModel.js';

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
			if (key==='UserWaterNowModel'||key==='UserHeatingNowModel'||key==='UserElectricityNowModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	/*
		EXTRA params for Models:
			this.type = options.type;    'sensor', 'energy', 'water'
			this.limit = options.limit;  1
			// timerange:
			//   - "NOW"
			//   - "NOW-24HOURS"
			//   - "NOW-7DAYS"
			//   - "NOW-1MONTH"
			this.timerange = options.timerange;
	*/
	initialize() {
		const model_WaterNow = new UserWaterNowModel({name:'UserWaterNowModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,timerange:'NOW'});
		model_WaterNow.subscribe(this);
		this.master.modelRepo.add('UserWaterNowModel',model_WaterNow);
		this.models['UserWaterNowModel'] = model_WaterNow;
		
		const model_HeatingNow = new UserHeatingNowModel({name:'UserHeatingNowModel',src:'data/sivakka/apartments/feeds.json',type:'sensor',limit:1,timerange:'NOW'});
		model_HeatingNow.subscribe(this);
		this.master.modelRepo.add('UserHeatingNowModel',model_HeatingNow);
		this.models['UserHeatingNowModel'] = model_HeatingNow;
		
		const model_EleNow = new UserElectricityNowModel({name:'UserElectricityNowModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,timerange:'NOW'});
		model_EleNow.subscribe(this);
		this.master.modelRepo.add('UserElectricityNowModel',model_EleNow);
		this.models['UserElectricityNowModel'] = model_EleNow;
		
		
		/*
		
		TODO:
		
		Add models for "NOW-24HOURS", "NOW-7DAYS" and "NOW-1MONTH" to be able to calculate TOTALS for different time periods!
		
		
		*/
		
		
		
		
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
		this.timers['UserPageView'] = {timer: undefined, interval: 60000, models:['UserWaterNowModel','UserHeatingNowModel','UserElectricityNowModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
