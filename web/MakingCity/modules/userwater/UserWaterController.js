import Controller from '../common/Controller.js';
import { UserWaterNowModel } from  './UserWaterModel.js';
import UserWaterView from './UserWaterView.js';

export default class UserWaterController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	
	/*
		NOTE:
		- UserWater???Model
		- UserHeating???Model
		- UserElectricity???Model
		are created at UserPageController
		
	*/
	
	init() {
		this.models['UserWaterNowModel'] = this.master.modelRepo.get('UserWaterNowModel');
		this.models['UserWaterNowModel'].subscribe(this);
		
		this.timers['UserWaterView'] = {timer: undefined, interval: 30000, models:['UserWaterNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserWaterView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
