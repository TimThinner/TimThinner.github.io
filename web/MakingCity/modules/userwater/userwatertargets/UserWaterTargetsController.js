import Controller from '../../common/Controller.js';
import UserWaterTargetsView from './UserWaterTargetsView.js';

export default class UserWaterTargetsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// super.remove(); call PeriodicPoller remove();
			//Object.keys(this.timers).forEach(key => {
			// if (this.timers[key].timer) {
			//	 clearTimeout(this.timers[key].timer);
			//	 this.timers[key].timer = undefined;
			// }
			//});
		//Object.keys(this.models).forEach(key => {
		//	this.models[key].unsubscribe(this);
		//});
		//if (this.view) {
		//	this.view.remove();
		//	this.view = undefined;
		//}
		this.models = {};
	}
	
	initialize() {
		/*
		NOTE: Every Controller must subscribe for "MenuModel" notifications.
		After that all view changes are driven by code in BASE CLASS Controller notify(options)
		*/
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserWaterTargetsView(this);
	}
	
	clean() {
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
