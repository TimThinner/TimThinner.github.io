import Controller from '../../common/Controller.js';
import UserElectricityTargetsView from './UserElectricityTargetsView.js';

export default class UserElectricityTargetsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	
	
	init() {
		this.models['UserElectricityNowModel'] = this.master.modelRepo.get('UserElectricityNowModel');
		this.models['UserElectricityNowModel'].subscribe(this);
		
		//this.timers['UserElectricityView'] = {timer: undefined, interval: -1, models:['UserElectricityNowModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityTargetsView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
