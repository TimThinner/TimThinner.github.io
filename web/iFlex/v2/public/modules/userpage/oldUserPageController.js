import Controller from '../common/Controller.js';
//import UserApartmentModel from './UserApartmentModel.js';
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
		this.models = {};
	}
	
	/*
		EXTRA params for Models:
			this.type = options.type;    'sensor', 'energy', 'water'
			this.limit = options.limit;  1
			this.range = options.range;
	*/
	initialize() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserPageView(this);
	}
	
	clean() {
		
		this.remove();
		console.log('UserPageController is now REALLY cleaned!');
		
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
		//this.timers['UserPageView'] = {timer: undefined, interval: 60000, models:['UserWaterNowModel','UserElectricityNowModel','UserHeatingNowModel','UserWaterDayModel','UserElectricityDayModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
