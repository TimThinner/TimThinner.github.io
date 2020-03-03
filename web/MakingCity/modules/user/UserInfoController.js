import Controller from '../common/Controller.js';
import UserInfoView from './UserInfoView.js';

export default class UserInfoController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	restore() {
		
	}
	
	init() {
		
		this.models['UserModel'] = this.master.modelRepo.get('UserModel');
		this.models['UserModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserInfoView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
