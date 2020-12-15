import Controller from '../common/Controller.js';
import UserApartmentModel from '../userpage/UserApartmentModel.js';
import UserAlarmModel from './UserAlarmModel.js';
import UserAlarmView from './UserAlarmView.js';

export default class UserAlarmController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserAlarmModel') {
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
			this.range = options.range;
	*/
	initialize() {
		const model = new UserAlarmModel({name:'UserAlarmModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('UserAlarmModel',model);
		this.models['UserAlarmModel'] = model;
		
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserAlarmView(this);
	}
	
	clean() {
		console.log('UserAlarmController is now REALLY cleaned!');
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
		this.timers['UserAlarmView'] = {timer: undefined, interval: 60000, models:['UserAlarmModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
