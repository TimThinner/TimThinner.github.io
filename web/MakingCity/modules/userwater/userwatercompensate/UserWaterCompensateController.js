import Controller from '../../common/Controller.js';
import UserWaterCompensateView from './UserWaterCompensateView.js';

export default class UserWaterCompensateController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		this.models['UserWaterNowModel'] = this.master.modelRepo.get('UserWaterNowModel');
		this.models['UserWaterNowModel'].subscribe(this);
		
		//this.timers['UserWaterView'] = {timer: undefined, interval: -1, models:['UserWaterNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserWaterCompensateView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
