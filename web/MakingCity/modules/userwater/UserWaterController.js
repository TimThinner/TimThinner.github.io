import Controller from '../common/Controller.js';
import { UserWaterWeekModel, UserWaterMonthModel } from  './UserWaterModel.js';
import UserWaterView from './UserWaterView.js';

export default class UserWaterController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserWaterWeekModel'||key==='UserWaterMonthModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	/*
		NOTE:
		- UserWaterNowModel and UserWaterDayModel are created at UserPageController
		
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
		
		this.models['UserWaterNowModel'] = this.master.modelRepo.get('UserWaterNowModel');
		this.models['UserWaterNowModel'].subscribe(this);
		
		this.models['UserWaterDayModel'] = this.master.modelRepo.get('UserWaterDayModel');
		this.models['UserWaterDayModel'].subscribe(this);
		
		const model_WaterWeek = new UserWaterWeekModel({name:'UserWaterWeekModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,timerange:'NOW-7DAYS'});
		model_WaterWeek.subscribe(this);
		this.master.modelRepo.add('UserWaterWeekModel',model_WaterWeek);
		this.models['UserWaterWeekModel'] = model_WaterWeek;
		
		const model_WaterMonth = new UserWaterMonthModel({name:'UserWaterMonthModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,timerange:'NOW-1MONTH'});
		model_WaterMonth.subscribe(this);
		this.master.modelRepo.add('UserWaterMonthModel',model_WaterMonth);
		this.models['UserWaterMonthModel'] = model_WaterMonth;
		
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserWaterView(this);
	}
	
	clean() {
		console.log('UserWaterController is now REALLY cleaned!');
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
		this.timers['UserWaterView'] = {timer: undefined, interval: 60000, models:['UserWaterNowModel','UserWaterDayModel','UserWaterWeekModel','UserWaterMonthModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
