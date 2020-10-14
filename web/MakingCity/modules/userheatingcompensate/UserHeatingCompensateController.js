import Controller from '../common/Controller.js';
import { UserHeatingNowModel } from  '../userheating/UserHeatingModel.js';
import UserHeatingCompensateView from './UserHeatingCompensateView.js';

export default class UserHeatingCompensateController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		this.models['UserHeatingNowModel'] = this.master.modelRepo.get('UserHeatingNowModel');
		this.models['UserHeatingNowModel'].subscribe(this);
		
		//this.timers['UserHeatingView'] = {timer: undefined, interval: -1, models:['UserHeatingNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingCompensateView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
