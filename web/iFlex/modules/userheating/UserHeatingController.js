import Controller from '../common/Controller.js';
import UserHeatingModel from  './UserHeatingModel.js';
import UserHeatingView from './UserHeatingView.js';

export default class UserHeatingController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 6;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserHeatingModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		/*
			When we create a UserHeatingModel, we want to add some additional parameters,
			for example how long cache keeps the data (cache expiration in seconds) and 
			the fetching interval (also in seconds).
		*/
		const UHM = new UserHeatingModel({
			name:'UserHeatingModel',
			// NOTE: host: 'ba.vtt.fi' is added at the backend
			src:'/obixStore/store/NuukaOpenData/1752%20Malmitalo/Heat/query/',
			cache_expiration_in_seconds:60,
			timerange: { begin: 10, end: 2 },
			access:'PRIVATE'
		});
		UHM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('UserHeatingModel',UHM);
		this.models['UserHeatingModel'] = UHM;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingView(this);
	}
	
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
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
		const interval = this.fetching_interval_in_seconds * 1000; // once per 60 seconds by default.
		this.timers['UserHeatingView'] = {timer:undefined, interval:interval, models:['UserHeatingModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
