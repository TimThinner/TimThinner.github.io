import Controller from '../common/Controller.js';
import { UserWaterNowModel } from  '../userwater/UserWaterModel.js';
import UserWaterTargetsView from '../userwatertargets/UserWaterTargetsView.js';

export default class UserWaterTargetsController extends Controller {
	
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
		
		this.view = new UserWaterTargetsView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
