import Controller from '../common/Controller.js';
import { UserHeatingNowModel } from  '../userheating/UserHeatingModel.js';
import UserHeatingChartsView from './UserHeatingChartsView.js';

export default class UserHeatingChartsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		this.models['UserHeatingNowModel'] = this.master.modelRepo.get('UserHeatingNowModel');
		this.models['UserHeatingNowModel'].subscribe(this);
		
		this.timers['UserHeatingView'] = {timer: undefined, interval: 30000, models:['UserHeatingNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingChartsView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
