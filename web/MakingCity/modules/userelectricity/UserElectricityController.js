import Controller from '../common/Controller.js';
import { UserElectricityWeekModel, UserElectricityMonthModel } from  './UserElectricityModel.js';
import UserElectricityView from './UserElectricityView.js';

export default class UserElectricityController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserElectricityWeekModel'||key==='UserElectricityMonthModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	/*
		NOTE:
		- UserElectricityNowModel and UserElectricityDayModel are created at UserPageController
		
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
		
		this.models['UserElectricityNowModel'] = this.master.modelRepo.get('UserElectricityNowModel');
		this.models['UserElectricityNowModel'].subscribe(this);
		
		this.models['UserElectricityDayModel'] = this.master.modelRepo.get('UserElectricityDayModel');
		this.models['UserElectricityDayModel'].subscribe(this);
		
		const model_ElectricityWeek = new UserElectricityWeekModel({name:'UserElectricityWeekModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,timerange:'NOW-7DAYS'});
		model_ElectricityWeek.subscribe(this);
		this.master.modelRepo.add('UserElectricityWeekModel',model_ElectricityWeek);
		this.models['UserElectricityWeekModel'] = model_ElectricityWeek;
		
		const model_ElectricityMonth = new UserElectricityMonthModel({name:'UserElectricityMonthModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,timerange:'NOW-1MONTH'});
		model_ElectricityMonth.subscribe(this);
		this.master.modelRepo.add('UserElectricityMonthModel',model_ElectricityMonth);
		this.models['UserElectricityMonthModel'] = model_ElectricityMonth;
		
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
	
	
	clean() {
		console.log('UserElectricityController is now REALLY cleaned!');
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
		this.timers['UserElectricityView'] = {timer: undefined, interval: 60000, models:['UserElectricityNowModel','UserElectricityDayModel','UserElectricityWeekModel','UserElectricityMonthModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
