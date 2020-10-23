import Controller from '../common/Controller.js';
import UserApartmentModel from '../userpage/UserApartmentModel.js';
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
			this.timerange = options.timerange;
			// timerange:
			//   - {ends:{value:0,unit:'minutes'},starts:{value:10,unit:'minutes'}}
			//   - {ends:{value:24,unit:'hours'},starts:{value:10,unit:'minutes'}}
			//   - {ends:{value:7,unit:'days'},starts:{value:10,unit:'minutes'}}
			//   - {ends:{value:1,unit:'months'},starts:{value:10,unit:'minutes'}}
	*/
	initialize() {
		const weekTR = {ends:{value:7,unit:'days'},starts:{value:10,unit:'minutes'}};
		const monthTR = {ends:{value:1,unit:'months'},starts:{value:10,unit:'minutes'}};
		
		this.models['UserWaterNowModel'] = this.master.modelRepo.get('UserWaterNowModel');
		this.models['UserWaterNowModel'].subscribe(this);
		
		this.models['UserWaterDayModel'] = this.master.modelRepo.get('UserWaterDayModel');
		this.models['UserWaterDayModel'].subscribe(this);
		
		const model_WaterWeek = new UserApartmentModel({name:'UserWaterWeekModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,timerange:weekTR});
		model_WaterWeek.subscribe(this);
		this.master.modelRepo.add('UserWaterWeekModel',model_WaterWeek);
		this.models['UserWaterWeekModel'] = model_WaterWeek;
		
		const model_WaterMonth = new UserApartmentModel({name:'UserWaterMonthModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,timerange:monthTR});
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
