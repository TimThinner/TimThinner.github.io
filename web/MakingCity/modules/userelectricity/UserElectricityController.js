import Controller from '../common/Controller.js';
import { UserElectricityNowModel } from  './UserElectricityModel.js';
import UserElectricityView from './UserElectricityView.js';

export default class UserElectricityController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	
	
	init() {
		this.models['UserElectricityNowModel'] = this.master.modelRepo.get('UserElectricityNowModel');
		this.models['UserElectricityNowModel'].subscribe(this);
		
		this.timers['UserElectricityView'] = {timer: undefined, interval: 30000, models:['UserElectricityNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
